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

function initChecker(_event: any) {
  const checkTimer = setInterval(checkForFinish, 150)
  function checkForFinish() {
    if (document.querySelector('table')) {
      clearInterval(checkTimer)
      initComponents()
    }
  }
}

function initComponents() {
  console.info('[vitesse-webext] Hello world from content script')

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

  // inject css
  const styleEl = document.createElement('link')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  document.head.appendChild(styleEl)

  // shadowDOM.appendChild(styleEl)
  const fieldList = storageConf.value.fields
  for (const field of fieldList) {
    const tooltip = createApp(Tooltip)

    tooltip.use(ElementPlus)
    setupApp(tooltip)
    const mountEle = document.createElement('div')
    mountEle.setAttribute('class', 'inline-block')
    const thEle = document.querySelector(field.location)
    thEle?.appendChild(mountEle)
    // pass info to app by the 'vm' and 'toRef'
    const vm = tooltip.mount(mountEle)
    const info = toRef<any, string>(vm, 'info')
    info.value = field.hint_popup
    console.log(`title2.value: ${info.value}`) // --> My App
  }

  // app.mount(root)
}
