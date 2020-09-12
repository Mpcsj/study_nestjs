const TAG = 'util.paths'
export function getPath():string{
    let res = __dirname.replace('/dist/util','/src')
    return res
}

export function getRootPath():string{
    // console.log(TAG,"::getRootPath")
    let res = __dirname
    res = res.replace('/dist/src/util','')
    // console.log(TAG,"::diretorio atual:",res)
    return res
}