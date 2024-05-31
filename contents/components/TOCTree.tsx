import React from "react"

// 递归组件，渲染树形结构
const TreeNode = ({ node }) => {
  const handleJump = () => {
    const target = document.querySelector(`[data-tocid="${node.hash}"]`)

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  return (
    <li className={`level-${node.level}`}>
      <a href={`#${node.hash}`} onClick={handleJump}>
        {node.content}{" "}
      </a>

      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </ul>
      )}
    </li>
  )
}

// 主组件，渲染整个树
const TOCTree = ({ data }) => {
  return (
    <ul className="level-0">
      {data.map((node, index) => (
        <TreeNode key={index} node={node} />
      ))}
    </ul>
  )
}

export default TOCTree
