	/*
	 *1.succData请求入参 
	 *2.viewType图表展示类型 bar pie map 
	 *3.viewId需要展示图表id
	 */
	var chartHander = {};
	chartHander.loadPage = function(succData, viewType, viewId) {
		debugger;
		var retData = succData;
		var myChart = echarts.init(document.getElementById(viewId), 'vintage');
		// 默认设置成柱状图显示属性及数据
		if (viewType == null || viewType == "" || viewType == undefined) {
			// 初始化图表标签
			var barData = initBarData(retData);
			myChart.setOption(barData, true);
		} else {
			if (viewType == "bar") {
				var barData = initBarData(retData);
				myChart.setOption(barData, true);
			} else if (viewType == "pie") {
				// 饼状图数据及属性
				var pieData = initPieData(retData);
				myChart.setOption(pieData, true);
			} else if (viewType == "map") {
				// 初始化地图数据
				var mapData = initMapData();
				myChart.setOption(mapData, true);
			}
		}
	}
	
	/*
	 * 初始化条形图/饼状图数据
	 * 
	 */
	function initBarData(retData) {
		var barOption = {
			// 鼠标悬浮时显示
			tooltip : {
				trigger : 'axis',
				axisPointer : {
					type : 'shadow'
				}
			},
			// 图例
			legend : {
				data : setChartxAxis(retData.dataMap[1])
			},
			// 工具栏显示
			toolbox : {
				show : true,
				orient : 'vertical',
				x : '745',
				y : 'center',
				feature : {
					mark : {
						show : false
					},
					dataView : {
						show : false,
						readOnly : false
					},
					magicType : {
						show : true,
						type : [ 'line', 'bar', 'stack', 'tiled' ]
					},
					restore : {
						show : true
					},
					saveAsImage : {
						show : false
					}
				}
			},
			calculable : false,
			xAxis : [ {
				type : 'category',
				data : setChartxAxis(retData.dataMap[0])
			} ],
			yAxis : [ {
				type : 'value'
			} ],
			series : (function() {
				var arr = [];
				for ( var i = 0; i < retData.dataMap[1].length; i++) {
					arr.push({
						name : retData.dataMap[1][i],
						type : 'bar',
						data : (function() {
							var a = [];
							for ( var j = 0; j < retData.dataMap[0].length; j++) {
								a.push({
									name : j,
									value : retData.dataMap[i + 2][j]
								});
							}
							return a;
						})(),
					});
				}
				return arr;
			})(),
		};
		return barOption;
	}
	
	/*
	 * 初始化饼状图数据
	 */
	function initPieData(retData) {
		var pieOption = {
			title : {
				text : '数据测试',
				x : 'center'
			},
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			legend : {
				orient : 'vertical',
				x : 'left',
				data : (function() {
					var arr = [];
					if (retData.dataMap[0].length > 0) {
						var len = retData.dataMap[0].length;
						for ( var i = 0; i < len; i++) {
							// arr.push(retData.dataMap[0][i]);
						}
					}
					return arr;
				})(),
			},
			toolbox : {
				show : true,
				feature : {
					mark : {
						show : false
					},
					dataView : {
						show : false,
						readOnly : false
					},
					magicType : {
						show : true,
						type : [ 'pie', 'funnel' ],
						option : {
							funnel : {
								x : '25%',
								width : '50%',
								funnelAlign : 'left',
								max : 1548
							}
						}
					},
					restore : {
						show : true
					},
					saveAsImage : {
						show : false
					}
				}
			},
			calculable : true,
			series : [ {
				name : '饼状图',
				type : 'pie',
				radius : '55%',
				center : [ '50%', '60%' ],
				data : (function() {
					debugger;
					var arr = [];
					if (retData.dataMap[1].length > 0) {
	
						var len = retData.dataMap[1].length;
						for ( var i = 0; i < len; i++) {
							arr
									.push({
										name : retData.dataMap[1][i],
										type : 'pie',
										radius : '55%',
										value : (function() {
											var count = 0;
											for ( var j = 0; j < retData.dataMap[0].length; j++) {
												count += parseFloat(retData.dataMap[i + 2][j]);
											}
											return count;
										})(),
	
									});
						}
					}
					return arr;
				})(),
			} ]
		};
		return pieOption;
	}
	
	/*
	 * 地图数据初始化（暂未完成）
	 * 
	 */
	function initMapData() {
		var mapOption = {
			title : {
				text : '测试数据',
				x : 'center'
			},
			tooltip : {
				trigger : 'item'
			},
			legend : {
				orient : 'vertical',
				x : 'left',
				data : [ 'iphone3', 'iphone4', 'iphone5' ]
			},
			dataRange : {
				min : 0,
				max : 2500,
				x : 'left',
				y : 'bottom',
				text : [ '高', '低' ], // 文本，默认为数值文本
				calculable : true
			},
			toolbox : {
				show : true,
				orient : 'vertical',
				x : 'right',
				y : 'center',
				feature : {
					mark : {
						show : false
					},
					dataView : {
						show : false,
						readOnly : false
					},
					restore : {
						show : true
					},
					saveAsImage : {
						show : false
					}
				}
			},
			roamController : {
				show : true,
				x : 'right',
				mapTypeControl : {
					'china' : true
				}
			},
			series : [ {
				name : 'iphone3',
				type : 'map',
				mapType : 'china',
				roam : true,
				itemStyle : {
					normal : {
						label : {
							show : true
						}
					},
					emphasis : {
						label : {
							show : true
						}
					}
				},
				data : [ {
					name : '北京',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '天津',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '上海',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '重庆',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '河北',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '河南',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '云南',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '辽宁',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '黑龙江',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '湖南',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '安徽',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '山东',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '新疆',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '江苏',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '浙江',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '江西',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '湖北',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '广西',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '甘肃',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '山西',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '内蒙古',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '陕西',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '吉林',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '福建',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '贵州',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '广东',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '青海',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '西藏',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '四川',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '宁夏',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '海南',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '台湾',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '香港',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '澳门',
					value : Math.round(Math.random() * 1000)
				} ]
			}, {
				name : 'iphone4',
				type : 'map',
				mapType : 'china',
				itemStyle : {
					normal : {
						label : {
							show : true
						}
					},
					emphasis : {
						label : {
							show : true
						}
					}
				},
				data : [ {
					name : '北京',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '天津',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '上海',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '重庆',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '河北',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '安徽',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '新疆',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '浙江',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '江西',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '山西',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '内蒙古',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '吉林',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '福建',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '广东',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '西藏',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '四川',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '宁夏',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '香港',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '澳门',
					value : Math.round(Math.random() * 1000)
				} ]
			}, {
				name : 'iphone5',
				type : 'map',
				mapType : 'china',
				itemStyle : {
					normal : {
						label : {
							show : true
						}
					},
					emphasis : {
						label : {
							show : true
						}
					}
				},
				data : [ {
					name : '北京',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '天津',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '上海',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '广东',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '台湾',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '香港',
					value : Math.round(Math.random() * 1000)
				}, {
					name : '澳门',
					value : Math.round(Math.random() * 1000)
				} ]
			} ]
		};
		return mapOption;
	}
	
	function getItemData(index) {
		var arr = [];
		if (retData.dataMap[index]) {
			var ret = retData.dataMap[index];
			for ( var i = 0; i < ret.length; i++) {
				arr.push({
					name : ret[i],
					value : ret[i]
				});
			}
		}
		return arr;
	}
	
	// 动态生成X轴数据
	function setChartxAxis(selectData) {
		var arr = [];
		if (selectData) {
			for ( var i = 0; i < selectData.length; i++) {
				arr.push(selectData[i]);
			}
		}
		return arr;
	}
