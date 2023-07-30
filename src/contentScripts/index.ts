/* eslint-disable no-console */
import { onMessage } from 'webext-bridge/content-script'
import { createApp, toRef } from 'vue'
import ElementPlus from 'element-plus'
import Tooltip from './views/Tooltip.vue'
import SideBar from './views/SideBar.vue'
import { setupApp } from '~/logic/common-setup'
import 'element-plus/dist/index.css'
import { storageConf } from '~/logic/storage'

window.addEventListener('load', initChecker, false)
// communication example: send previous tab title from background page
onMessage('tab-prev', ({ data }) => {
  console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
})

const tooltipSet: HTMLElement[] = []

// 页面加载完毕检测，成功后，开始加载组件
function initChecker(_event: any) {
  const checkInterval = 200
  const checkMaxTime = 10000 // 最大检查时间
  const checkMaxCount = checkMaxTime / checkInterval
  let checkCount = 0
  const checkTimer = setInterval(checkForFinish, 150)
  function checkForFinish() {
    if (document.querySelector('.ge-drawer-layer')) {
      clearInterval(checkTimer)
      setTimeout(() => {
        pageCompleted()
      }, 2000)
    }
    if (checkCount > checkMaxCount)
      clearInterval(checkTimer)
    checkCount++
  }
}

function labelDetecter(node: HTMLElement | Document) {
  console.log(node.nodeType)

  const specEleClassList = ['.issue-detail_fields.mt-2']
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
  const styleEl = document.createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  document.head.appendChild(styleEl)
}

// 页面加载成功后，创建固定元素；根据页面内容，选择是否创建tooltip
function pageCompleted() {
  initCss()
  initSidear()
  startObserver()
  // if (document.querySelector('[class="ge-drawer active ge-issue-detail-drawer"]')) {
  //   initTooltip()
  // }
}

function startObserver() {
  // 监听元素变化，符合要求时，初始化tooltip
  const targetNode = document.querySelector('.ge-drawer-layer')!
  console.log('???')
  console.log(targetNode)
  const observeConfig = { attributes: true, childList: true, subtree: true }
  const observerForSideBar = new MutationObserver(observerCallback)
  observerForSideBar.observe(targetNode, observeConfig)

  // 监听页面变化，符合要求时，初始化tooltip
  if (labelDetecter(document)) {
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
  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  // const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  container.appendChild(root)
  const sidebar = createApp(SideBar)
  sidebar.use(ElementPlus)
  setupApp(sidebar)
  sidebar.mount(root)
  document.body.appendChild(container)
}

function initTooltip() {
  console.log('????????????????????????????????')
  deleteTooltip()

  // 遍历配置中各个字段，找到相应的标签，将tooltip初始化
  const promptsList = storageConf.value.prompts
  console.log(promptsList)
  for (const prompt of promptsList) {
    const tooltip = createApp(Tooltip)

    tooltip.use(ElementPlus)
    setupApp(tooltip)
    const mountEle = document.createElement('div')
    mountEle.setAttribute('class', '')
    console.log(prompt.location)
    const thEle = document.querySelector(prompt.location)
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
