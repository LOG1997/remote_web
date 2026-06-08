import React from 'react'
import { LeafKey } from '../../entrypoints/content'
import './index.css'
type Props={
    extractContents:DocumentFragment,
    leafKey:LeafKey|undefined
}

export  function LeafElement(props:Props) {
    const {extractContents,leafKey}=props
    const htmlContent = new XMLSerializer().serializeToString(extractContents)
    const handleChildClick = (e: React.MouseEvent<HTMLSpanElement>,key:LeafKey|undefined) => {
        e.stopPropagation();
        e.preventDefault();
        console.log('handle leaf child click', e)
        console.log('leaf content key', key)
    }
  return (
    <span className={leafKey+'-leaf'+' leaf-element'}  dangerouslySetInnerHTML={{ __html: htmlContent }} onClick={(e)=>handleChildClick(e,leafKey)} >
    </span>
  )
}
