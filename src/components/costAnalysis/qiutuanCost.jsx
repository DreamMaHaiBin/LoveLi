import React, { Component } from "react";
import OneTable from './children/oneTable'
import ChangLiang from './children/chanliang1'
import EchartsBar from './children/echartsBar'
import EchartsPie from './children/echartsCirl'
import './index.scss'
class PelletCostAnalysis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            PelletCostAnalysisName: '球团'
        }
    }
    render() {
        return (
            <div className="const-analysis-body">
                <OneTable componentName={this.state.PelletCostAnalysisName}/>
                <ChangLiang componentName={this.state.PelletCostAnalysisName}/>
                <ChangLiang componentName={this.state.PelletCostAnalysisName}/>
                <EchartsBar componentName={this.state.PelletCostAnalysisName}/>
                <ChangLiang componentName={this.state.PelletCostAnalysisName}/>
                <ChangLiang componentName={this.state.PelletCostAnalysisName}/>
                <ChangLiang componentName={this.state.PelletCostAnalysisName}/>
                <EchartsPie componentName={this.state.PelletCostAnalysisName}/>
                <ChangLiang componentName={this.state.PelletCostAnalysisName}/>
            </div>
        )
    }

}
export default PelletCostAnalysis