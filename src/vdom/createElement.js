export default (tagName,{attrs = {},children = []} = {})=>{
    return {
        tagName,
        attrs: attrs,
        children: children,
    };
}