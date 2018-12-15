import render from './render'

const zip = (xs,ys)=>{
    const zipped = []
    for (let i = 0;i<Math.min(xs.length,ys.length);i++){
        zipped.push([xs[i],ys[i]])
    }

    return zipped
}

const diffAttrs = (oldAttrs,newAttrs)=>{
    const patches = []
    for (const [k,v] of Object.entries(newAttrs)){
        patches.push($node=>{
            $node.setAttribute(k,v)
            return $node
        })
    }

    for (const [k,v] of Object.entries(oldAttrs)){
        if(!(k in newAttrs)){
            patches.push($node=>{
                $node.removeAttribute(k)
                return $node
            })
        }
    }

    return $node=>{
        for (const patch of patches){
            patch($node)
        }
    }
}

const diffChildren = (oldChildren,newChildren) =>{
    const childPatches = []
    for(const [oldChild,newChild] of zip(oldChildren,newChildren)){
        childPatches.push(diff(oldChild,newChild))
    }

    const additionalPatches = []
    for (const additionalChild of newChildren.slice(oldChildren.length)){
        additionalPatches.push($node => {
            $node.appendChild(render(additionalChild))
            return $node
        })
    }
    
    return $parent =>{
        for(const [patch,child] of zip(childPatches,$parent.childNodes)){
            patch(child)
        }

        for(const patch of additionalPatches){
            patch(child)
        }
        return $parent
    }
}

const diff = (vOldNode,vNewNode)=>{
    if(vNewNode === undefined){
        return $node =>{
            $node.remove()
            return undefined
        }
    }

    if(typeof vOldNode === 'string' || typeof vNewNode === 'string'){
        if(vOldNode !== vNewNode){
            return $node =>{
                const $newNode = render(vNewNode) // DOM
                $node.replaceWith($newNode) // Mount
                return $newNode
            }
        }else{
            return $node=>undefined
        }
    }

    if(vOldNode.tagName !== vNewNode.tagName){
        return $node =>{
            const $newNode = render(vNewNode) // DOM
            $node.replaceWith($newNode) // Mount
            return $newNode
        }
    }

    const patchAttrs = diffAttrs(vOldNode.attrs,vNewNode.attrs)
    const patchChildren = diffChildren(vOldNode.children,vNewNode.children)
    
    return $node =>{
        patchAttrs($node) // Compare attrs on just JS Object and set to DOM
        patchChildren($node)
        return $node
    }
}

export default diff