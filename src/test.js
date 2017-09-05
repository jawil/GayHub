<!DOCTYPE html>
<html lang="en">

<head>
    <title>test</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>

    <script>
        /* 获取参数 */
        const oParam = function() {
            const pathname = "/jawil/github-extension"
            const parseParam = pathname.replace(/^\//, '').split('/')
            const oParam = {
                userName: '',
                reposName: '',
                branch: ''
            }
            oParam.userName = parseParam[0]
            oParam.reposName = parseParam[1]
            oParam.branch = parseParam[3] ? `trees/${parseParam[3]}` : 'trees/master'
            return oParam
        }()

        /* 获取所有的文件名 */
        const filePathName = function(callback) {
            const API = 'https://api.github.com/repos/'
            let parmArr = []
            for (let attr in oParam) {
                parmArr.push(oParam[attr])
            }
            parmArr.splice(2, 0, 'git')
            const getPathUrl = `${API}${parmArr.join('/')}?recursive=1`
            fetch('./data.json', {
                method: 'get'
            }).then(response => {
                return response.json()
            }).then(data => {
                callback(data.tree, 0, document.body)
            })
        }(generatePath)

        let count = 0
            /* 组合拼装生成想要的嵌套格式 */
        function generatePath(files, count, parent) {

            /* 默认从第1级目录开始 */
            count++
            /* 筛选出第一层的tree和blob*/
            files.forEach((ele, i) => {
                let path = ele.path
                let type = ele.type
                    /* 求出此时元素的层级 */
                const cascading = ele.path.split('/').length

                let oOuterLi = document.createElement('li')

                if (cascading === count) {
                    oOuterLi.textContent = path
                    parent.appendChild(oOuterLi)
                   
                }

                /* 如果是文件夹 */
                if (type === 'tree') {

                    if (cascading === count) {

                        let oUl = document.createElement('ul')

                        /* 找出这个文件夹所有的目录 */
                        const filterArr = function() {
                            let isHaveDir = false

                            // console.log(ele.path,222)

                            /* 文件夹下面是否还有文件夹 */
                            files.forEach((item, index) => {

                                if (new RegExp(`^${ele.path}`).test(item.path)) {

                                    console.log(ele.path, item.path, 111)

                                    if (ele.path !== item.path) {

                                        let oInnerLi = document.createElement('li')


                                        if (item.type == 'tree') {
                                            files.splice(index, 1)
                                            isHaveDir = true

                                            arguments.callee(files, count, oUl)
                                        } else {

                                            /*   oInnerLi.textContent = item.path
                                              oUl.appendChild(oInnerLi)
                                              oOuterLi.appendChild(oUl) */

                                        }

                                        /* 如果这层文件夹下面没有文件夹了，就跳出递归 */
                                        if (!isHaveDir) {
                                            return
                                        }

                                    }
                                }
                            })


                        }()

                    }

                }

            })

        }
    </script>
</body>

</html>