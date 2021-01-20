const fs = require('fs')

let filenames = fs.readdirSync('./tmp', 'utf-8')
let data = {}
for (let filename of filenames) {
    if (filename[0] === '.') continue
    let path = `./tmp/${filename}`
    let f = fs.readFileSync(path, 'utf-8')
    let jsonFile = JSON.parse(f)
    let req = jsonFile[0]
    let params = new URL(req.url).searchParams
    let device_id = params.get('device_id')
    if (!data[device_id] && ~req.req.headers['cookie'].indexOf('sid_tt')) {
        data[device_id] = {
            cdid: params.get('cdid'),
            iid: params.get('iid'),
            device_id: params.get('device_id'),
            'x-tt-token': req.req.headers['x-tt-token'],
            cookie: req.req.headers['cookie'],
            time: new Date()
        }
    }
    fs.unlinkSync(path)
}
try {
    let r = fs.readFileSync('./result', 'utf-8')
    if (r) {
        let r_obj = JSON.parse(r)
        for (let n of r_obj) {
            if (~n.cookie.indexOf('sid_tt')) {
                data[n['device_id']] = n
            }
        }
    }
} catch (error) {

}
fs.writeFileSync('./result', JSON.stringify(Object.values(data), null, 2))