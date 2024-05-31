import styleText from "data-text:~/contents/style.scss"
import type { PlasmoGetStyle } from "plasmo"
import { useEffect, useState } from "react"

import TOCTree from "./components/TOCTree"

console.log("Hello Medium TOC")
function createTOCTree(data) {
  const tree = []
  const stack = [{ level: 0, children: tree }]

  data.forEach((item) => {
    const level = parseInt(item.tag.substring(1))
    const node = { ...item, children: [] }

    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop()
    }

    stack[stack.length - 1].children.push(node)
    stack.push({ level, children: node.children })
  })

  return tree
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const getTOC = () => {
  const article = document.querySelector("article")

  const items = article.querySelectorAll("h1, h2, h3, h4, h5,h6")
  const list = Array.from(items)

  const tocList = list.map((item, idx) => {
    const level = parseInt(item.tagName.substring(1))
    return {
      tag: item.tagName,
      level: level,
      content: item.textContent,
      hash: `toc-idx-${idx}`
    }
  })

  list.forEach((item, idx) => {
    item.setAttribute("data-tocId", `toc-idx-${idx}`)
  })

  const toc = createTOCTree(tocList)
  return toc
}

const MediumTOC = () => {
  const [toc, setTOC] = useState(getTOC())

  useEffect(() => {
    const targetNode = document.body
    const config = { childList: true, subtree: true }
    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          // 检查 URL 是否变化
          setTOC(getTOC())
        }
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)
  }, [])
  return (
    <div className="toc-medium-extension">
      <TOCTree data={toc} />
    </div>
  )
}

export default MediumTOC
