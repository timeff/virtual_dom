import createElement from './vdom/createElement'
import render from './vdom/render'
import mount from './vdom/mount'
import diff from './vdom/diff'

// Concept is checking the differences on JS Object before touching real DOMs

// TODO
// - Use Publish - Subscribe instead of setInterval


const createVApp = (count) => createElement('div',{
    attrs:{
        id:'app',
        dataCount:count,
    },
    children:[
        createElement('input',{
            attrs:{
             
            },
        }),
        String(count),
        createElement('img',{
            attrs:{
                src:'https://media.giphy.com/headers/2018-11-28-55-1543442119/top-gifs-of-2018.gif'
            },
        })
    ]
})
let count = 0
let vApp = createVApp(count) // JS Object
const $app = render(vApp) // DOM

let $rootEl = mount($app,document.getElementById('app')) // Put DOM on target element

setInterval(()=>{
    count++
    const vNewApp = createVApp(count)
    const patch = diff(vApp,vNewApp) // Return function that receive old node / replace them / create new one
    $rootEl = patch($rootEl)
    vApp = vNewApp
},1000)
