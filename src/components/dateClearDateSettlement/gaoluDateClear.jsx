import React, { Component } from "react";
import './common.scss'
import { Input, Button, message } from "antd";
import axios from "axios";
import { gaoluListData } from '../util/shaojieTable'
// 高炉日清日结
const str = '0.00'
export default class DateClearDateSettlementFurnace extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ListData: gaoluListData
        }
    }
    componentDidMount() {
        this.initData()
    }
     initData() {
        axios({
            method: "get",
            url: "/api/rqrjgl/",
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        }).then(res => {
            console.log(res)
            if (res.status === 200 && res.data && res.data.dos) {
                this.setState({
                    ListData: res.data.dos
                })
            } else {
                this.setState({
                    ListData: gaoluListData
                })
            }
        }).catch(error => {
            console.log(error)
            message.error("数据获取错，请稍后重试")
            this.setState({
                ListData: gaoluListData
            })
        })
    }
    mustNumber(e) {
        if (!e.target.value.replace(/[^\d^\.]+/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')) {
            e.target.value = ''
        }

    }
    infoKuang(name, index) {
        return (e) => {
            const value = e.target.value;
            const newData = this.state.ListData;
            newData[index][name] = value;
            this.setState({ ListData: newData })
        }
    }
    saveData() {
        axios({
            method: "post",
            url: "/api/rqrjgl/",
            headers: {
                Authorization: sessionStorage.getItem("token")
            },
            data: {
                dos: this.state.ListData
            }
        }).then(res => {
            console.log(res)
            message.success("保持成功")

        }).catch(error => {
            console.log(error)
            message.error("数据保存失败，请稍后重试！")
        })
    }
    cmputendData() {
        const dataComputed = JSON.parse(JSON.stringify(this.state.ListData))
        dataComputed.forEach((obj, index) => {
            if (index === 1 || index === 2 || index === 3 || index === 26 || index === 30 || index === 34 || index === 35 || index === 36 || index === 43 || index === 44 || index === 55 || index === 65 || index === 77) {
                obj['qcrcb'] = obj['qcdj'] * obj['qcrdh']
                obj['qcycb'] = obj['qcdj'] * obj['qcydh']

                obj['yglrcb'] = obj['qcdj'] * obj['yglrdh']
                obj['yglrcb'] = obj['qcdj'] * obj['yglydh']

                obj['eglrcb'] = obj['qcdj'] * obj['eglrdh']
                obj['eglrcb'] = obj['qcdj'] * obj['eglydh']

                obj['sglrcb'] = obj['qcdj'] * obj['sglrdh']
                obj['sglrcb'] = obj['qcdj'] * obj['sglydh']

            }
            if (index === 3 || index === 26 || index === 30 || index === 36 || index === 44 || index === 55 || index === 65 || index === 77) {
                // 主要几个标黑的矿粉
                let startNum
                let endNum
                switch (index) {
                    case 3:
                        startNum = 4
                        endNum = 25
                        break;
                    case 26:
                        startNum = 27
                        endNum = 29
                        break;
                    case 30:
                        startNum = 31
                        endNum = 33
                        break;
                    case 36:
                        startNum = 37
                        endNum = 39
                        break;
                    case 44:
                        startNum = 45
                        endNum = 49
                        break;
                    case 55:
                        startNum = 56
                        endNum = 64
                        break;
                    case 77:
                        startNum = 78
                        endNum = 80
                        break;
                    default:
                        break;
                }
                obj['qcrdh'] = this.sum(startNum, endNum, dataComputed, 'qcrdh')
                obj['qcydh'] = this.sum(startNum, endNum, dataComputed, 'qcydh')
                obj['qcrcb'] = this.sum(startNum, endNum, dataComputed, 'qcrcb')
                obj['qcycb'] = this.sum(startNum, endNum, dataComputed, 'qcycb')

                obj['yglrdh'] = this.sum(startNum, endNum, dataComputed, 'yglrdh')
                obj['yglydh'] = this.sum(startNum, endNum, dataComputed, 'yglydh')
                obj['yglrcb'] = this.sum(startNum, endNum, dataComputed, 'yglrcb')
                obj['yglycb'] = this.sum(startNum, endNum, dataComputed, 'yglycb')

                obj['eglrdh'] = this.sum(startNum, endNum, dataComputed, 'eglrdh')
                obj['eglydh'] = this.sum(startNum, endNum, dataComputed, 'eglydh')
                obj['eglrcb'] = this.sum(startNum, endNum, dataComputed, 'eglrcb')
                obj['eglycb'] = this.sum(startNum, endNum, dataComputed, 'eglycb')

                obj['sglrdh'] = this.sum(startNum, endNum, dataComputed, 'sglrdh')
                obj['sglydh'] = this.sum(startNum, endNum, dataComputed, 'sglydh')
                obj['sglrcb'] = this.sum(startNum, endNum, dataComputed, 'sglrcb')
                obj['sglycb'] = this.sum(startNum, endNum, dataComputed, 'sglycb')

            }
            if (index === 34) {
                obj['qcycb'] = dataComputed[35]['qcycb'] + dataComputed[43]['qcycb'] + dataComputed[65]['qcycb'] + dataComputed[82]['qcycb']
                obj['yglycb'] = dataComputed[35]['yglycb'] + dataComputed[43]['yglycb'] + dataComputed[65]['yglycb'] + dataComputed[82]['yglycb']
                obj['eglycb'] = dataComputed[35]['eglycb'] + dataComputed[43]['eglycb'] + dataComputed[65]['qcycb'] + dataComputed[82]['qcycb']
                obj['sglycb'] = dataComputed[35]['sglycb'] + dataComputed[43]['sglycb'] + dataComputed[65]['sglycb'] + dataComputed[82]['sglycb']
            }
            if (index === 43) {
                obj['qcycb'] = dataComputed[44]['qcycb'] + dataComputed[44]['qcycb']
                obj['yglycb'] = dataComputed[44]['yglycb'] + dataComputed[44]['yglycb']
                obj['eglycb'] = dataComputed[44]['eglycb'] + dataComputed[44]['eglycb']
                obj['sglycb'] = dataComputed[44]['sglycb'] + dataComputed[44]['sglycb']
            }
            if (index === 65) {
                obj['qcycb'] = this.sum(66, 81, dataComputed, 'qcycb')
                obj['yglycb'] = this.sum(66, 81, dataComputed, 'yglycb')
                obj['eglycb'] = this.sum(66, 81, dataComputed, 'eglycb')
                obj['sglycb'] = this.sum(66, 81, dataComputed, 'sglycb')
            }
            if (index === 2) {
                // 主要几个标黑的矿粉
                obj['qcrdh'] = dataComputed[3]['qcrdh'] + dataComputed[26]['qcrdh'] + dataComputed[30]['qcrdh']
                obj['qcydh'] = dataComputed[3]['qcydh'] + dataComputed[26]['qcydh'] + dataComputed[30]['qcydh']
                obj['qcrcb'] = dataComputed[3]['qcrcb'] + dataComputed[26]['qcrcb'] + dataComputed[30]['qcrcb']
                obj['qcycb'] = dataComputed[3]['qcycb'] + dataComputed[26]['qcycb'] + dataComputed[30]['qcycb']

                obj['yglrdh'] = dataComputed[3]['yglrdh'] + dataComputed[26]['yglrdh'] + dataComputed[26]['yglrdh']
                obj['yglydh'] = dataComputed[3]['yglydh'] + dataComputed[26]['yglydh'] + dataComputed[26]['yglydh']
                obj['yglrcb'] = dataComputed[3]['yglrcb'] + dataComputed[26]['yglrcb'] + dataComputed[26]['yglrcb']
                obj['yglycb'] = dataComputed[3]['yglycb'] + dataComputed[26]['yglycb'] + dataComputed[26]['yglycb']

                obj['eglrdh'] = dataComputed[3]['eglrdh'] + dataComputed[26]['eglrdh'] + dataComputed[26]['eglrdh']
                obj['eglydh'] = dataComputed[3]['eglydh'] + dataComputed[26]['eglydh'] + dataComputed[26]['eglydh']
                obj['eglrcb'] = dataComputed[3]['eglrcb'] + dataComputed[26]['eglrcb'] + dataComputed[26]['eglrcb']
                obj['eglycb'] = dataComputed[3]['eglycb'] + dataComputed[26]['eglycb'] + dataComputed[26]['eglycb']

                obj['sglrdh'] = dataComputed[3]['sglrdh'] + dataComputed[26]['sglrdh'] + dataComputed[26]['sglrdh']
                obj['sglydh'] = dataComputed[3]['sglydh'] + dataComputed[26]['sglydh'] + dataComputed[26]['sglydh']
                obj['sglrcb'] = dataComputed[3]['sglrcb'] + dataComputed[26]['sglrcb'] + dataComputed[26]['sglrcb']
                obj['sglycb'] = dataComputed[3]['sglycb'] + dataComputed[26]['sglycb'] + dataComputed[26]['sglycb']
            }
        })
        dataComputed.forEach((obj, index) => {
            if (index === 2 || index === 3 || index === 26 || index === 30 || index === 36 || index === 43 || index === 44 || index === 55 || index === 77) {
                obj['qcdj'] = obj['qcycb'] / obj['qcrdh'] * 1000
            }
            console.log(obj.yglycb === NaN)
        })
        dataComputed[0]['yglycb'] = dataComputed[0]['yglrcb'] * 30
        dataComputed[0]['eglycb'] = dataComputed[0]['eglrcb'] * 30
        dataComputed[0]['sglycb'] = dataComputed[0]['sglrcb'] * 30
        dataComputed[0]['qcycb'] = dataComputed[0]['yglycb'] * dataComputed[0]['eglycb'] + dataComputed[0]['sglycb']

        dataComputed[1]['qcycb'] = dataComputed[6]['qcycb'] + dataComputed[34]['qcycb']
        dataComputed[1]['yglycb'] = dataComputed[6]['yglycb'] + dataComputed[34]['yglycb']
        dataComputed[1]['eglycb'] = dataComputed[6]['eglycb'] + dataComputed[34]['eglycb']
        dataComputed[1]['sglycb'] = dataComputed[6]['sglycb'] + dataComputed[34]['sglycb']
        
        dataComputed.forEach(obj=>{
            obj.qcrdh = String(obj.qcrdh) === "NaN" || String(obj.qcrdh) === "null" ? null : obj.qcrdh.toFixed(4)
            obj.qcydh = String(obj.qcydh) === "NaN" || String(obj.qcydh) === "null" ? null : obj.qcydh.toFixed(4)
            obj.qcrcb = String(obj.qcrcb) === "NaN" || String(obj.qcrcb) === "null" ? null : obj.qcrcb.toFixed(2)
            obj.qcycb = String(obj.qcycb) === "NaN" || String(obj.qcycb) === "null" ? null : obj.qcycb.toFixed(2)

            obj.yglrdh = String(obj.yglrdh) === "NaN" || String(obj.yglrdh) === "null" ? null : obj.yglrdh.toFixed(4)
            obj.yglydh = String(obj.yglydh) === "NaN" || String(obj.yglydh) === "null" ? null : obj.yglydh.toFixed(4)
            obj.yglrcb = String(obj.yglrcb) === "NaN" || String(obj.yglrcb) === "null" ? null : obj.yglrcb.toFixed(2)
            obj.yglycb = String(obj.yglycb) === "NaN" || String(obj.yglycb) === "null" ? null : obj.yglycb.toFixed(2)

            obj.eglrdh = String(obj.eglrdh) === "NaN" || String(obj.eglrdh) === "null" ? null : obj.eglrdh.toFixed(4)
            obj.eglydh = String(obj.eglydh) === "NaN" || String(obj.eglydh) === "null" ? null : obj.eglydh.toFixed(4)
            obj.eglrcb = String(obj.eglrcb) === "NaN" || String(obj.eglrcb) === "null" ? null : obj.eglrcb.toFixed(2)
            obj.eglycb = String(obj.eglycb) === "NaN" || String(obj.eglycb) === "null" ? null : obj.eglycb.toFixed(2)

            obj.sglrdh = String(obj.sglrdh) === "NaN" || String(obj.sglrdh) === "null" ? null : obj.sglrdh.toFixed(4)
            obj.sglydh = String(obj.sglydh) === "NaN" || String(obj.sglydh) === "null" ? null : obj.sglydh.toFixed(4)
            obj.sglrcb = String(obj.sglrcb) === "NaN" || String(obj.sglrcb) === "null" ? null : obj.sglrcb.toFixed(2)
            obj.sglycb = String(obj.sglycb) === "NaN" || String(obj.sglycb) === "null" ? null : obj.seglycb.toFixed(2)
        })
        this.setState({ ListData: dataComputed },()=>{console.log(this.state.ListData)})
    }
    // 累加函数
    sum(startName, num, array, name) {
        var sum = 0;
        for (var i = startName; i <= num; i++) {
            sum += array[i][name];
        }
        return sum;

    }
    render() {
        return (
            <div className="date-clear-date-settlemen-body">
                <div className="date-clear-date-settlemen-title">
                    <Button type="primary" onClick={this.cmputendData.bind(this)}>计算</Button>
                    <Button type="primary" onClick={this.saveData.bind(this)}>保存</Button>
                </div>
                <div className="date-clear-date-settlemen-div">
                    <table className="date-clear-date-settlemen-table">
                        <tbody>
                            <tr>
                                <td rowSpan="2" style={{width:70}}>成本项目</td>
                                <td rowSpan="2" style={{width:40}}>单位</td>
                                <td colSpan={5}>全厂</td>
                                <td colSpan={4}>一高炉</td>
                                <td colSpan={4}>二高炉</td>
                                <td colSpan={4}>三高炉</td>
                            </tr>
                            <tr>
                                <td>单价</td>
                                <td>日单耗</td>
                                <td>月单耗</td>
                                <td>日成本</td>
                                <td>月成本</td>
                                <td>日单耗</td>
                                <td>月单耗</td>
                                <td>日成本</td>
                                <td>月成本</td>
                                <td>日单耗</td>
                                <td>月单耗</td>
                                <td>日成本</td>
                                <td>月成本</td>
                                <td>日单耗</td>
                                <td>月单耗</td>
                                <td>日成本</td>
                                <td>月成本</td>
                            </tr>
                            {
                                this.state.ListData.map((item, index) => {
                                    return (
                                        <tr key={index} className={
                                            index === 0 ? 'date-clear-date-settlemen-table-blue' :
                                                index === 1 || index === 2 || index === 3 || index === 26 || index === 30 || index === 34 || index === 35 || index === 36 || index === 43 || index === 44 || index === 55 || index === 65 || index === 77 ? 'date-clear-date-settlemen-table-yellow' :
                                                    'date-clear-date-settlemen-table-none'
                                        } >
                                            <td><Input
                                                value={item.name}
                                                onChange={this.infoKuang("name", index).bind(this)}
                                            /></td>
                                            {/* <td><Input
                                                value={item.dw}
                                                onChange={this.infoKuang("dw", index).bind(this)}
                                            >
                                            </Input>
                                            </td> */}
                                            <td>
                                                {
                                                    index === 0 ? '万吨' : index === 1 || index === 2 || index === 3 || index === 34 || index === 40 || index === 41 || index === 65 || index === 77 || index === 81 || index === 82 ? '元' : index === 72 || index === 79 ? 'KWH' : index === 66 || index === 67 || index === 68 || index === 73 || index === 74 || index === 75 || index === 76 ? "M3" : "吨"
                                                }
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.qcdj === str || item.qcdj === 0 ? 0 : item.qcdj}
                                                    onChange={this.infoKuang("qcdj", index).bind(this)}
                                                >
                                                </Input>
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.qcrdh === str || item.qcrdh === 0 ? 0 : item.qcrdh}
                                                    onChange={this.infoKuang("qcrdh", index).bind(this)}
                                                >
                                                </Input>
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.qcydh === str || item.qcydh === 0 ? 0 : item.qcydh}
                                                    onChange={this.infoKuang("qcydh", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.qcrcb === str || item.qcrcb === 0 ? 0 : item.qcrcb}
                                                    onChange={this.infoKuang("qcrcb", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.qcycb === str || item.qcycb === 0 ? 0 : item.qcycb}
                                                    onChange={this.infoKuang("qcycb", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.yglrdh === str || item.yglrdh === 0 ? 0 : item.yglrdh}
                                                    onChange={this.infoKuang("yglrdh", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.yglydh === str || item.yglydh === 0 ? 0 : item.yglydh}
                                                    onChange={this.infoKuang("yglydh", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.yglrcb === str || item.yglrcb === 0 ? 0 : item.yglrcb}
                                                    onChange={this.infoKuang("yglrcb", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.yglycb === str || item.yglycb === 0 ? 0 : item.yglycb}
                                                    onChange={this.infoKuang("yglycb", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.eglrdh === str || item.eglrdh === 0 ? 0 : item.eglrdh}
                                                    onChange={this.infoKuang("eglrdh", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.eglydh === str || item.eglydh === 0 ? 0 : item.eglydh}
                                                    onChange={this.infoKuang("eglydh", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.eglrcb === str || item.eglrcb === 0 ? 0 : item.eglrcb}
                                                    onChange={this.infoKuang("eglrcb", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.eglycb === str || item.eglycb === 0 ? 0 : item.eglycb}
                                                    onChange={this.infoKuang("eglycb", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.sglrdh === str || item.sglrdh === 0 ? 0 : item.sglrdh}
                                                    onChange={this.infoKuang("sglrdh", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.sglydh === str || item.sglydh === 0 ? 0 : item.sglydh}
                                                    onChange={this.infoKuang("sglydh", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.sglrcb === str || item.sglrcb === 0 ? 0 : item.sglrcb}
                                                    onChange={this.infoKuang("sglrcb", index).bind(this)}
                                                />
                                            </td>
                                            <td>
                                                <Input onKeyUp={this.mustNumber.bind(this)}
                                                    value={item.sglycb === str || item.sglycb === 0 ? 0 : item.sglycb}
                                                    onChange={this.infoKuang("sglycb", index).bind(this)}
                                                />
                                            </td>
                                        </tr>
                                    )

                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}