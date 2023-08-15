/* eslint-disable no-console */
import { onMessage } from 'webext-bridge/content-script'
import { createApp, toRef } from 'vue'
import ElementPlus from 'element-plus'
import Tooltip from './views/Tooltip.vue'
import SideBar from './views/SideBar.vue'
import { setupApp } from '~/logic/common-setup'
import 'element-plus/dist/index.css'
import { storageConf } from '~/logic/storage'
import { getDocument, getElement, getPageConfig } from '~/utils/commUtils'

window.addEventListener('load', event => setTimeout(event => initChecker(event), 1500), false)
// communication example: send previous tab title from background page
onMessage('tab-prev', ({ data }) => {
  console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
})

const tooltipSet: HTMLElement[] = []
// const pageType = storageConf.value.page_type
let pageConfig: any = null

// 页面加载完毕检测，成功后，开始加载组件
function initChecker(_event: any) {
  // 根据url读取相应的页面配置信息
  pageConfig = getPageConfig(storageConf.value.page_config, window.location.href)
  if (!pageConfig) {
    console.log('没有找到页面配置项，请检查')
    return
  }

  const checkInterval = 1000
  const checkMaxTime = 20000 // 最大检查时间
  const checkMaxCount = checkMaxTime / checkInterval
  let checkCount = 0
  const checkTimer = setInterval(checkForFinish, checkInterval)

  function checkForFinish() {
    if (getElement(pageConfig.page_type, pageConfig.condition_for_pageload.locate_method, pageConfig.condition_for_pageload.location)) {
      clearInterval(checkTimer)
      setTimeout(() => {
        pageCompleted(pageConfig.init_type)
      }, 2000)
    }
    else {
      console.log('Page not inited')
    }
    if (checkCount > checkMaxCount) {
      console.log('Exceeded the maximum number of init check')
      clearInterval(checkTimer)
    }
    checkCount++
  }
}

function labelDetecter(node: HTMLElement | Document) {
  // 判断传入的node中，是否含有指定条件的元素（该元素的出现是判断是否要渲染tooltip的要素）
  const specEleClassList = pageConfig.condition_for_tooltip_label.locations
  for (const eleCls of specEleClassList) {
    if (node.nodeType !== Node.TEXT_NODE && node.querySelector(eleCls)) {
      console.info('Detected label field for tooltip position')
      return true
    }
  }
  return false
}

function initCss() {
  // inject css
  const styleEl = getDocument(pageConfig.page_type).createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  getDocument(pageConfig.page_type).head.appendChild(styleEl)

  // if (pageConfig.page_type === 'normal') {
  //   document.head.appendChild(styleEl)
  // } else if (pageConfig.page_type === 'iframe') {
  //   document.querySelector("iframe")!.contentWindow!.document.head.appendChild(styleEl)
  // }
}

// 页面加载成功后，创建固定元素；根据页面内容，选择是否创建tooltip
function pageCompleted(initType: string) {
  initCss()
  initSidear()
  if (initType === 'observer')
    startObserver()

  else if (initType === 'direct')
    initTooltip()
}

function startObserver() {
  // 监听元素变化，符合要求时，初始化tooltip
  const targetParentNode = getElement(pageConfig.page_type, pageConfig.condition_for_observe_parentnode.locate_method,
    pageConfig.condition_for_observe_parentnode.location)! // 要监听的元素（页面加载完就存在、且新出现的元素是其子节点）
  if (!targetParentNode) {
    console.log('要监听的元素为空，请检查')
  }
  else {
    const observeConfig = { attributes: true, childList: true, subtree: true }
    const observerForSideBar = new MutationObserver(observerCallback)
    observerForSideBar.observe(targetParentNode, observeConfig)
  }
  console.log('???')
  console.log(targetParentNode)

  // 监听页面变化，符合要求时，初始化tooltip
  if (labelDetecter(getDocument(pageConfig.page_type))) {
    setTimeout(() => {
      initTooltip()
    }, 1000)
  }
}

// 页面元素变化的回调函数
function observerCallback(mutationList: any, _: any) {
  let inited = false
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes) {
        console.info(node)
        // 出现特定类型的label元素后，创建tooltip。需要注意所选的元素出现时，tooltip挂载的元素是否已加载
        if (labelDetecter(node)) {
          setTimeout(() => {
            initTooltip()
          }, 1000)
          inited = true
          break
        }
      }
    }
    else if (mutation.type === 'attributes') {
      // console.log(`The ${mutation.attributeName} attribute was modified.`)
    }

    if (inited)
      break
  }
}

function initSidear() {
  // mount component to context window
  // create global element
  const container = getDocument(pageConfig.page_type).createElement('div')
  container.id = __NAME__
  const root = getDocument(pageConfig.page_type).createElement('div')
  // const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  container.appendChild(root)
  const sidebar = createApp(SideBar, {
    fieldsConf: storageConf.value.fields,
    verifiConf: storageConf.value.verification,
    pageType: pageConfig.page_type,
    formContainConf: pageConfig.form_container,
  })
  sidebar.use(ElementPlus)
  setupApp(sidebar)
  sidebar.mount(root)
  getDocument(pageConfig.page_type).body.appendChild(container)
}

function initTooltip() {
  console.log('initTooltip')
  deleteTooltip()

  // 遍历配置中各个字段，找到相应的标签，将tooltip初始化
  const promptsList = storageConf.value.prompts
  console.log(promptsList)
  for (const prompt of promptsList) {
    const thEle = getElement(pageConfig.page_type, prompt.locate_method, prompt.location)!
    if (!thEle)
      continue

    console.log(`找到标签：${prompt.field_name}`)
    console.log(prompt.location)

    const tooltip = createApp(Tooltip)
    tooltip.use(ElementPlus)
    setupApp(tooltip)
    const mountEle = getDocument(pageConfig.page_type).createElement('div')
    mountEle.setAttribute('class', 'inline-block')

    thEle.classList.add('flex')
    thEle.classList.add('items-center')
    thEle?.appendChild(mountEle)

    // pass info to app by the 'vm' and 'toRef'
    const vm = tooltip.mount(mountEle)
    const info = toRef<any, string>(vm, 'info')
    info.value = prompt.hint_popup

    tooltipSet.push(mountEle)
    console.log(`title2.value: ${info.value}`) // --> My App
  }

  // app.mount(root)
}

function deleteTooltip() {
  for (const tip of tooltipSet)
    tip.remove()
}
