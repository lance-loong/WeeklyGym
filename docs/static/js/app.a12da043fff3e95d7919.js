webpackJsonp([1],{AFSw:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});a("tvR6");var n=a("qBF2"),o=a.n(n),r=a("7+uW"),i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var s=a("VU/8")({name:"App"},i,!1,function(t){a("gsu9")},null,null).exports,l=a("/ocq"),u=a("//Fk"),c=a.n(u),d=a("Zrlr"),m=a.n(d),p=a("wxAW"),h=a.n(p),f=a("mvHQ"),v=a.n(f),_=a("mtWM"),b=a.n(_);var w=function(t,e){return new c.a(function(a,n){var o={query:e},r={method:"post",baseURL:"https://api.github.com",url:"/graphql",timeout:1e4,params:o,data:o,headers:{Authorization:"Bearer "+t,"X-Requested-With":"XMLHttpRequest","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}};delete r.params,b()(r).then(function(t){200!=t.status?n([{message:"response.status != 200, response.status = "+t.status}]):void 0!=t.data.errors?n(t.data.errors):a(t.data.data)}).catch(function(t){n([{message:"network error !!!"}])})})};function g(t){return escape(v()(t))}function D(t){return JSON.parse(unescape(t))}var y=function(){function t(e,a,n,o){m()(this,t),this.m_szToken=e,this.m_szOwner=a,this.m_szRepository=n,this.m_szDatabaseName=o,this.m_aryExecute=[],this.m_bConnect=!1,this.m_pUser=null,this.m_pRepository=null,this.m_szDatabaseID=null}return h()(t,[{key:"Connect",value:function(){var t=this.m_szToken,e=this.m_szOwner,a=this.m_szRepository,n=this.m_szDatabaseName,o=this;return new c.a(function(r,i){w(t,'query{\nuser(login:"'+e+'"){\n  id\n  name\n}\nrepository(owner:"'+e+'", name:"'+a+'"){\n  id\n  name\n  label(name:"'+n+'"){\n    id\n    name\n  }\n}\n}').then(function(t){var a=t.user,n=t.repository,s=n.label;return null==a?i([{message:"user not create : "+e}]):(o.m_pUser={id:a.id,name:a.name},null==n?i([{message:"repository not create : "+o.m_szRepository}]):(o.m_pRepository={id:n.id,name:n.name},null==s?i([{message:"label not create : "+o.m_szDatabaseName}]):(o.m_szDatabaseID=s.id,o.m_bConnect=!0,void r())))},function(t){i(t)})})}},{key:"AddData",value:function(t){var e=this.m_pUser,a=this.m_szToken,n=this.m_pRepository,o=this.m_szDatabaseID;return new c.a(function(r,i){var s=g(t),l='mutation {\n        createIssue( input: {\n          repositoryId : "'+n.id+'",\n          title : "data",\n          body : "'+s+'",\n          assigneeIds : [ "'+e.id+'" ],\n          labelIds : [ "'+o+'" ]\n        } ){\n          issue{\n            id\n            body\n            updatedAt\n          }\n        }\n      }';w(a,l).then(function(t){var e=t.createIssue.issue;e.data=D(e.body),r(e)},i)})}},{key:"DelData",value:function(t){var e=this.m_szToken;return new c.a(function(a,n){w(e,'mutation{\n        deleteIssue(input:{\n          issueId:"'+t+'"\n        }){\n          clientMutationId\n        }\n      }').then(a,n)})}},{key:"UpdData",value:function(t,e){var a=this.m_szToken;return new c.a(function(n,o){var r=g(e);w(a,'mutation{\n  updateIssue(input:{ id:"'+t+'", body:"'+r+'" }){\n    issue{\n      id\n    }\n  }\n}').then(n,o)})}},{key:"GetDataCount",value:function(){var t=this.m_szOwner,e=this.m_szToken,a=this.m_szRepository,n=this.m_szDatabaseName;return new c.a(function(o,r){w(e,'query{\n  repository(owner:"'+t+'", name:"'+a+'"){\n      issues(labels:"'+n+'"){\n      totalCount\n    }\n  }\n}').then(function(t){console.log(t),o()},r)})}},{key:"GetDataAfter",value:function(t,e){var a=this.m_szOwner,n=this.m_szToken,o=this.m_szRepository,r=this.m_szDatabaseName;return t=t?'"'+t+'"':"null",new c.a(function(i,s){w(n,'query{\n  repository(owner:"'+a+'", name:"'+o+'"){\n    issues(labels:"'+r+'", first:'+e+", after:"+t+"){\n      edges{\n        cursor\n        node{\n          id\n          body\n          updatedAt\n        }\n      }\n    }\n  }\n}").then(function(t){for(var e=t.repository.issues.edges,a=[],n=0;n<e.length;++n){var o=e[n].cursor,r=e[n].node;r.data=D(r.body),r.github_cursor=o,a.push(r)}i(a)},s)})}},{key:"GetAllData",value:function(){var t=this;return new c.a(function(e,a){var n=[];!function e(a,o,r,i){t.GetDataAfter(a,o).then(function(t){for(var a=0;a<t.length;++a)n.push(t[a]);0==t.length?r(n):e(t[t.length-1].github_cursor,o,r,i)},function(t){i(t)})}(null,100,e,a)})}}]),t}(),k={methods:{querySearchName:function(t,e){var a=this.restaurants;e(t?a.filter(function(){}):a)},tableRowClassName:function(t){t.row;var e=t.rowIndex;return 0==e?"":e%2==0?"warning-row":"success-row"},handleClickAdd:function(){var t={name:"",date:(new Date).toString(),activity:"",amount:0},e=this;this.m_pDatabase.AddData(t).then(function(t){e.tableData.push(t)},function(t){e.DialogError(t)})},handleClickDel:function(){for(var t=this.$refs.multipleTable.selection,e=this,a=this.m_pDatabase,n=0;n<t.length;++n){var o=t[n];a.DelData(o.id).then(function(){var t=e.tableData.indexOf(o);e.tableData.splice(t,1)},function(t){e.DialogError(t)})}},handleChange:function(t){var e=this;this.m_pDatabase.UpdData(t.id,t.data).then(function(){e.StatisticsData()},function(t){e.$router.go(0)})},Dialog:function(t){this.pDialog.message=t,this.pDialog.visible=!0},DialogError:function(t){for(var e="",a=0;a<t.length;++a)e+=t[a].message+"<br >";this.Dialog(e)},StatisticsData:function(){var t=new Date;t.setMilliseconds(0),t.setSeconds(0),t.setMinutes(0),t.setHours(0);for(var e=t.getTime()-864e5*(t.getDay()-1),a=e+6048e5,n=this.tableData,o={},r=0;r<n.length;++r){var i=n[r].data.name||"",s=n[r].data.date||(new Date).toString(),l=(n[r].data.activity,new Number(n[r].data.amount||0)),u=o[i];if(""!=i){u||(u={name:"",join_date:(new Date).toString(),train_total:0,train_cur_week:0,amount:0,amount_total:0,achievement_percentage:"",achievement_percentage_total:""},o[i]=u);var c=new Date(s),d=new Date(u.join_date);c.getTime()<d.getTime()&&(o[i].join_date=s),c.getTime()>=e&&c.getTime()<a&&(++o[i].train_cur_week,o[i].amount+=l),++o[i].train_total,o[i].amount_total+=l}}for(var i in this.tableStatistics=[],o){var m=o[i];m.name=i,this.tableStatistics.push(m)}}},data:function(){return{pDialog:{visible:!1,message:""},pAddData:{time:new Date,name:"",gym:""},tableData:[],tableStatistics:[]}},watch:{tableData:function(t){this.StatisticsData()}},mounted:function(){var t=new y(atob("NTcxNDkzZjFlNGIxNGY3OWUyNTFkMzkzMGMwYmRhY2NiZjI0YmFjYg=="),"lance-loong","WeeklyGym","database");this.m_pDatabase=t;var e=this;t.Connect().then(function(e){return t.GetAllData()},function(t){e.DialogError(t)}).then(function(t){for(var a=[],n=0;n<t.length;++n)a.push(t[n]);e.tableData=a},function(t){e.DialogError(t)})}},z={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"block"},[a("h1",[t._v("统计数据")]),t._v(" "),a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableStatistics,stripe:""}},[a("el-table-column",{attrs:{prop:"name",label:"姓名"}}),t._v(" "),a("el-table-column",{attrs:{prop:"join_date",label:"加入时间",width:"240"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-date-picker",{attrs:{clearable:!1,align:"right",type:"date",readonly:!0},model:{value:e.row.join_date,callback:function(a){t.$set(e.row,"join_date",a)},expression:"scope.row.join_date"}})]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"train_total",label:"总运动次数"}}),t._v(" "),a("el-table-column",{attrs:{prop:"train_cur_week",label:"当前周运动次数"}}),t._v(" "),a("el-table-column",{attrs:{prop:"amount",label:"当前周贡献金额"}}),t._v(" "),a("el-table-column",{attrs:{prop:"amount_total",label:"总贡献金额"}}),t._v(" "),a("el-table-column",{attrs:{prop:"achievement_percentage",label:"成就度"}}),t._v(" "),a("el-table-column",{attrs:{prop:"achievement_percentage_total",label:"总成就度"}})],1),t._v(" "),a("el-divider"),t._v(" "),a("h1",[t._v("数据列表")]),t._v(" "),a("el-button",{on:{click:function(e){return t.handleClickAdd()}}},[t._v("添加记录")]),t._v(" "),a("el-button",{on:{click:function(e){return t.handleClickDel()}}},[t._v("删除记录")]),t._v(" "),a("el-button",{on:{click:function(e){return t.handleClickInp()}}},[t._v("导入记录")]),t._v(" "),a("el-button",{on:{click:function(e){return t.handleClickOut()}}},[t._v("导出记录")]),t._v(" "),a("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:"","row-class-name":t.tableRowClassName}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),t._v(" "),a("el-table-column",{attrs:{prop:"data.name",label:"姓名"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-input",{on:{blur:function(a){return t.handleChange(e.row)}},model:{value:e.row.data.name,callback:function(a){t.$set(e.row.data,"name",a)},expression:"scope.row.data.name"}})]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"data.activity",label:"活动"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-input",{on:{blur:function(a){return t.handleChange(e.row)}},model:{value:e.row.data.activity,callback:function(a){t.$set(e.row.data,"activity",a)},expression:"scope.row.data.activity"}})]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"data.date",label:"时间"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-date-picker",{attrs:{clearable:!1,align:"right",type:"date",placeholder:"选择日期"},on:{blur:function(a){return t.handleChange(e.row)}},model:{value:e.row.data.date,callback:function(a){t.$set(e.row.data,"date",a)},expression:"scope.row.data.date"}})]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"data.amount",label:"贡献金额"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-input",{on:{blur:function(a){return t.handleChange(e.row)}},model:{value:e.row.data.amount,callback:function(a){t.$set(e.row.data,"amount",a)},expression:"scope.row.data.amount"}})]}}])})],1),t._v(" "),a("el-dialog",{attrs:{title:"提示",visible:t.pDialog.visible,width:"30%"},on:{"update:visible":function(e){return t.$set(t.pDialog,"visible",e)}}},[a("span",[t._v(t._s(t.pDialog.message))]),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.pDialog.visible=!1}}},[t._v("确 定")])],1)])],1)},staticRenderFns:[]};var C=a("VU/8")(k,z,!1,function(t){a("AFSw")},"data-v-0cc6fcf1",null).exports;r.default.use(l.a);var S=new l.a({routes:[{path:"/",name:"HelloWorld",component:C}]});r.default.use(o.a),new r.default({el:"#app",router:S,components:{App:s},template:"<App/>"})},gsu9:function(t,e){},tvR6:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.a12da043fff3e95d7919.js.map