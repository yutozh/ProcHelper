export function getElement(page_type: string, locate_method: string, location: string) {
    const doc = getDocument(page_type)
    let ele = null
    if (locate_method === 'querySelector') {
        ele = doc.querySelector(location)
    }
    return ele
}

export function getDocument(page_type: string): Document {
    if (page_type === 'normal') {
        return document
    } else if (page_type === 'iframe') {
        return document.querySelector("iframe")!.contentWindow!.document
    }
    console.log("不支持的页面类型，返回document")
    return document
}

export function getPageConfig(page_config: [any], url: string): any {
    for (const conf of page_config) {
        const regex = new RegExp(conf.url_reg, 'i'); // 使用'i'标志表示不区分大小写
        if (regex.test(url)) {
            return conf
        }
    }
    return null
}