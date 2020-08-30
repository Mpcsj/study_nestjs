export function getPath():string{
    let res = __dirname.replace('/dist/util','/src')
    return res
}