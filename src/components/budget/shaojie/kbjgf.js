import React, { Component } from "react";
import axios from "axios";
import {  Input, Button, Form, message,} from "antd"; 
const list=[]
for (let i = 0; i < 24; i++) {
    list.push({
        line: i+1,
        name: null,
        isTotal: false,
        purpose: 10,
        tFe: null,
        siO2: null,
        caO: null,
        mgO: null,
        al2O3: null,
        loI: null,
        feO: null,
        k2O: null,
        na2O: null,
        znO: null,
        s: null,
        p: null,
        tiO2: null,
        sRatio: null,
        price: null,
        ratio: null,
        r: null,
        esti: null,
    });
  }
const str = "0.00"
const strFour = "0.0000"

//烧结可变加工费
class BudgetJiaGongFei extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: [
                {
                    line: 1,
                    item: "运输带",
                    unit: "m",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 2,
                    item: "润滑油",
                    unit: "kg",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 3,
                    item: "活性炭",
                    unit: "t",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 4,
                    item: "氨水",
                    unit: "t",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 5,
                    item: "其他材料",
                    unit: "元",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }],
            numberH: [
                {
                    line: 1,
                    item: "煤",
                    unit: "吨",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 2,
                    item: "焦炉煤气",
                    unit: "m3",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 3,
                    item: "高炉煤气",
                    unit: "m3",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 4,
                    item: "电",
                    unit: "kwh",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 5,
                    item: "水",
                    unit: "m3",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 6,
                    item: "",
                    unit: "",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 7,
                    item: "",
                    unit: "",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                }, {
                    line: 8,
                    item: "",
                    unit: "",
                    signalUnit: null,
                    signalPrice: null,
                    signalPUnit: null
                },
            ],
            compted: [],//可变计算结果
            computedInfo: [],//单位成本
            subarr: {
                signalPrice: 0,
                signalUnit: 0,
                signalPUnit: 0,
            },
            RlComputed: {
                signalPrice: 0,
                signalUnit: 0,
                signalPUnit: 0,
            },
            boolen: false,
        }

    }
    componentWillMount() {
        const url = window.location.search ? 201 :this.props.tabKeys==="2" ? 102 : this.props.tabKeys==="3" ? 103 : 1
        axios.get(`/api/estimate-para-unfix-cost/recent/?purpose=${url}`, {
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        }).then((res) => {
            res.data.fc.forEach((item) => {
                item.signalPrice = Number(item.signalPrice).toFixed(2)
                item.signalUnit = Number(item.signalUnit).toFixed(4)
                item.signalPUnit = Number(item.signalPUnit).toFixed(2)
            })
            res.data.dl.forEach((item) => {
                item.signalPrice = Number(item.signalPrice).toFixed(2)
                item.signalUnit = Number(item.signalUnit).toFixed(4)
                item.signalPUnit = Number(item.signalPUnit).toFixed(2)
            })
            ////console.log(res)
            this.setState({
                number: res.data.fc,
                numberH: res.data.dl,
            })

        })
    }
    //计算燃料及动力的各行的数值
    RlComputedInfo() {
        const rlList = [];
        this.state.numberH.forEach((item) => {
            rlList.push(item.signalPrice * item.signalUnit);
        })
        this.setState({ RlComputed: rlList })
    }
    //计算辅材的个行的数值
    subfun() {
        //////console.log(this.state.number)
        const sub = [];
        this.state.number.forEach((item) => {
            sub.push(item.signalPrice * item.signalUnit);
        })
        this.setState({ subarr: sub })
    }
    calculate(signalPrice, index) {

        return (e) => {
            const value = e.target.value;
            const newPrice = this.state.number.slice();
            newPrice[index][signalPrice] = value;
            this.setState({ number: newPrice }, () => {
                this.subfun();
            })
            //////console.log(this.state.number)
        }
    }
    calculateDl(signalPrice, index) {

        return (e) => {
            const value = e.target.value;
            const newPriceDl = this.state.numberH.slice();
            newPriceDl[index][signalPrice] = value;
            this.setState({ numberH: newPriceDl }, () => {
                this.RlComputedInfo();
            })
            //////console.log(this.state.numberH)
        }
    }
    requestInfo() {
        this.setState({
            boolen: true
        })
        const url = window.location.search ? 201 :this.props.tabKeys==="2" ? 102 : this.props.tabKeys==="3" ? 103 : 1
        axios.post("/api/estimate-unfix/", {
            purpose: url,
            fc:
                this.state.number.map((item, index) => {
                    if (item.item === "") {
                        item.item = null
                    }
                    if (item.unit === "") {
                        item.unit = null
                    }
                    if (item.signalPrice === "") {
                        item.signalPrice = null
                    }
                    if (item.signalUnit === "") {
                        item.signalUnit = null;
                    }
                    return (
                        {
                            line: item.line,
                            item: item.item,
                            unit: item.unit,
                            signalPrice: item.signalPrice,
                            signalUnit: item.signalUnit,
                            signalPUnit:Number(this.state.subarr[index]).toFixed(2)==="NaN" ?item.signalPUnit:Number(this.state.subarr[index]).toFixed(2),
                            purpose: url,
                        }
                    )
                }),
            dl:
                this.state.numberH.map((items, index) => {
                    if (items.item === "") {
                        items.item = null
                    }
                    if (items.unit === "") {
                        items.unit = null
                    }
                    if (items.signalPrice === "") {
                        items.signalPrice = null
                    }
                    if (items.signalUnit === "") {
                        items.signalUnit = null;
                    }
                    return (
                        {
                            line: items.line,
                            item: items.item,
                            unit: items.unit,
                            signalPrice: items.signalPrice,
                            signalUnit: items.signalUnit,
                            signalPUnit:Number(this.state.RlComputed[index]).toFixed(2)==="NaN" ?items.signalPUnit:Number(this.state.RlComputed[index]).toFixed(2),
                            purpose: url,
                        }
                    )
                })
        }, {
            headers: {
                Authorization: sessionStorage.getItem("token")
            }
        }).then((res) => {
            if (res.status) {
                this.setState({
                    compted: res.data.amount,
                    computedInfo: res.data.fc,
                    boolen: false
                })
                this.props.KeBianFei(this.state.compted)
            }
            message.success("计算完成！")
        }).catch(err => {
            //////console.log(err)
            this.setState({
                boolen: false,
            })
            if (err.request.status === 500) {
                message.warning("请检查参数信息是否正确")
                

            } else if (err.request.status === 400) {
                message.warning("请检查参数信息是否正确")
              

            } else if (err.request.status === 401) {
                message.warning("你没有该权限！")
               
            }

        })
    }
    render() {
        // //////console.log(this.state.RlComputed)
        //////console.log(this.state.subarr)

        return (
            <div>
                <table className="tableGufei">
                    <tbody>
                        <tr>
                            <td style={{ width: 30 }}>序号</td>
                            <td>成本项目</td>
                            <td>计量单位</td>
                            <td>单价</td>
                            <td>单位消耗</td>
                            <td style={{ width: 110 }}>单位成本</td>
                        </tr>
                        <tr className="jiachu">
                            <td>一</td>
                            <td>辅助材料</td>
                            <td>元</td>
                            <td></td>
                            <td></td>
                            <td>
                                {
                                    this.state.compted.map((item, index) => {

                                        if (index === 0) {
                                            return (
                                                <span key={index} >
                                                    {item.signalPUnit === str ? null : Number(item.signalPUnit).toFixed(2)}
                                                </span>
                                            )
                                        }
                                        return null
                                    })
                                }
                            </td>
                        </tr>
                        {
                            this.state.number.map((item, index) => {


                                return (
                                    <tr key={index} className="trgufei">
                                        <td>{index + 1}</td>
                                        <td>
                                            <Input
                                                onChange={this.calculate("item", index).bind(this)}
                                                value={item.item}>
                                            </Input>
                                        </td>
                                        <td>
                                            <Input
                                                onChange={this.calculate("unit", index).bind(this)}
                                                value={item.unit}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                value={item.signalPrice === str ? null : item.signalPrice}
                                                onChange={this.calculate("signalPrice", index).bind(this)}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                value={item.signalUnit === strFour ? null : item.signalUnit}

                                                onChange={this.calculate("signalUnit", index).bind(this)}
                                            ></Input>

                                        </td>
                                        <td>
                                            {/* {item.signalPUnit === str ? null : item.signalPUnit} */}
                                            {Number(this.state.subarr[index]).toFixed(2) === "NaN" ? item.signalPUnit : Number(this.state.subarr[index]).toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        <tr className="jiachu">
                            <td>二</td>
                            <td>燃料及动力</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                {
                                    this.state.compted.map((item, index) => {
                                        if (index === 1) {
                                            return (
                                                <span key={index}>
                                                    {item.signalPUnit === "0.00" ? null : Number(item.signalPUnit).toFixed(2)}
                                                </span>
                                            )
                                        }
                                        return null;

                                    })
                                }
                            </td>
                        </tr>
                        {
                            this.state.numberH.map((item, index) => {


                                return (
                                    <tr key={index} className="trgufei">
                                        <td>{index + 1}</td>
                                        <td>
                                            <Input
                                                onChange={this.calculateDl("item", index).bind(this)}
                                                value={item.item}>
                                            </Input>
                                        </td>
                                        <td>
                                            <Input
                                                onChange={this.calculateDl("unit", index).bind(this)}
                                                value={item.unit}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                value={item.signalPrice === str ? null : item.signalPrice}
                                                onChange={this.calculateDl("signalPrice", index).bind(this)}
                                            ></Input>
                                        </td>
                                        <td>
                                            <Input
                                                value={item.signalUnit === strFour ? null : item.signalUnit}

                                                onChange={this.calculateDl("signalUnit", index).bind(this)}
                                            ></Input>
                                        </td>
                                        <td>
                                            {Number(this.state.RlComputed[index]).toFixed(2) === "NaN" ? item.signalPUnit : Number(this.state.RlComputed[index]).toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        <tr className="jiachu">
                            <td>三</td>
                            <td>烧结可变加工费合计</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                {
                                    this.state.compted.map((item, index) => {
                                        if (index === 3) {
                                            return (
                                                <span key={index}>
                                                    {Number(item.signalPUnit).toFixed(2)}
                                                </span>
                                            )
                                        }
                                        return null;
                                    })
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Button onClick={this.requestInfo.bind(this)} className="computed" disabled={this.state.boolen}>计算</Button>
            </div>
        )
    }
}
const WrappedGongFei = Form.create({ name: 'BudgetJiaGongFei' })(BudgetJiaGongFei);
export default WrappedGongFei