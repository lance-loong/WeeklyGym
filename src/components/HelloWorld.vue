<template>
  <div class=block>
    <h1>统计数据</h1>
    <el-table :data="tableStatistics" stripe style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="join_date" label="加入时间" width="240">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.join_date"
            :clearable="false"
            align="right"
            type="date"
            :readonly="true">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="train_total" label="总运动次数"></el-table-column>
      <el-table-column prop="train_cur_week" label="当前周运动次数"></el-table-column>
      <el-table-column prop="amount" label="当前周贡献金额"></el-table-column>
      <el-table-column prop="amount_total" label="总贡献金额"></el-table-column>
      <el-table-column prop="achievement_percentage" label="成就度"></el-table-column>
      <el-table-column prop="achievement_percentage_total" label="总成就度"></el-table-column>
    </el-table>
    <el-divider></el-divider>

    <h1>数据列表</h1>
    <el-button @click="handleClickAdd()">添加记录</el-button>
    <el-button @click="handleClickDel()">删除记录</el-button>
    <el-button @click="handleClickInp()">导入记录</el-button>
    <el-button @click="handleClickOut()">导出记录</el-button>
    <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column prop="data.name" label="姓名">
        <template slot-scope="scope">
          <el-input v-model="scope.row.data.name" @blur="handleChange( scope.row )"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="data.activity" label="活动">
        <template slot-scope="scope">
            <el-input v-model="scope.row.data.activity" @blur="handleChange( scope.row )"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="data.date" label="时间">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.data.date"
            @blur="handleChange( scope.row )"
            :clearable="false"
            align="right"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="data.amount" label="贡献金额">
        <template slot-scope="scope">
            <el-input v-model="scope.row.data.amount" @blur="handleChange( scope.row )"></el-input>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="提示"
      :visible.sync="pDialog.visible"
      width="30%">
      <span>{{ pDialog.message }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pDialog.visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CGithubDatabase from '../GithubDatabase.js'
  export default {
    methods: {
      querySearchName( queryString, cb ) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter( function(){} ) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb( results );
      },
      tableRowClassName({row, rowIndex}) {
        if( rowIndex == 0 )
          return '';
        if( rowIndex % 2 == 0 )
          return 'warning-row';
        else
          return 'success-row';
      },
      handleClickAdd()
      {
        const data =
        {
          name : '',
          date : ( new Date ).toString(),
          activity : '',
          amount : 0,
        };

        const This = this;
        const pDatabase = this.m_pDatabase;
        pDatabase.AddData( data ).then( function( data ){
          This.tableData.push( data );
        }, function( errors ){
          This.DialogError( errors );
        } );
      },
      handleClickDel()
      {
        var selection = this.$refs.multipleTable.selection;
        const This = this;
        const pDatabase = this.m_pDatabase;
        for( var i = 0; i < selection.length; ++i )
        {
          var data = selection[i];
          pDatabase.DelData( data.id ).then( function() {
            const i = This.tableData.indexOf( data );
            This.tableData.splice( i, 1 );
          }, function( errors ) {
            This.DialogError( errors );
          } );
        }
      },
      handleChange( data )
      {
        const This = this;
        const pDatabase = this.m_pDatabase;
        pDatabase.UpdData( data.id, data.data ).then( function(){
          This.StatisticsData();
        }, function( errors ) {
          This.$router.go(0);
        } );
      },
      Dialog( szMessage ){
        this.pDialog.message = szMessage;
        this.pDialog.visible = true;
      },
      DialogError( errors ) {
        var szMessage = '';
        for( var i = 0; i < errors.length; ++i )
          szMessage += errors[i].message + '<br \>';
        this.Dialog( szMessage );
      },
      StatisticsData(){
        const nDayTime = 24 * 60 * 60 * 1000;
        var pMondayDate = new Date;
        pMondayDate.setMilliseconds( 0 );
        pMondayDate.setSeconds( 0 );
        pMondayDate.setMinutes( 0 );
        pMondayDate.setHours( 0 );
        var nMondayTime = pMondayDate.getTime() - ( pMondayDate.getDay() - 1 ) * nDayTime;
        var nNextMondayTime = nMondayTime + 7 * nDayTime;

        var tableData = this.tableData;
        var statistics = {};
        var tolName = [];
        var tolactivity = [];
        for( var i = 0; i < tableData.length; ++i )
        {
          var name = tableData[i].data.name || '';
          var date = tableData[i].data.date || ( new Date ).toString();
          var activity = tableData[i].data.activity || '';
          var amount = new Number( tableData[i].data.amount || 0 );
          var curRow = statistics[name];

          // 排除新添加数据
          if( name == '' )
            continue;

          if( !curRow )
          {
            curRow =
            {
              name : '',
              join_date : ( new Date() ).toString(),
              train_total : 0,
              train_cur_week : 0,
              amount : 0,
              amount_total : 0,
              achievement_percentage : '',
              achievement_percentage_total : '',
            };
            statistics[name] = curRow;
          }

          var pDateCur = new Date( date );
          var pDatePer = new Date( curRow.join_date );

          if( pDateCur.getTime() < pDatePer.getTime() )
            statistics[name].join_date = date;
            // 本周数据
          if( pDateCur.getTime() >= nMondayTime && pDateCur.getTime() < nNextMondayTime )
          {
            ++statistics[name].train_cur_week;
            statistics[name].amount += amount;
          }
          ++statistics[name].train_total;
          statistics[name].amount_total += amount;
        }
        this.tableStatistics = [];
        for( var name in statistics )
        {
          var data = statistics[name];
          data.name = name;
          this.tableStatistics.push( data );
        }
      }
    },
    data() {
      return {
        pDialog : {
          visible : false,
          message : '',
        },
        pAddData : {
          time : new Date(),
          name : '',
          gym : '',
        },
        tableData : [],
        tableStatistics : [],
      }
    },
    watch : {
      tableData( val )
      {
        this.StatisticsData();
      }
    },
    mounted:function()
    {
      /**
       *
          {
            id : '',
            data :
            {
              name : "a",
              date : "2019-01-01 12:12:12",
              activity : "running",
            },
            updatedAt : '',
          }
       */
      const szBase64 = "NTcxNDkzZjFlNGIxNGY3OWUyNTFkMzkzMGMwYmRhY2NiZjI0YmFjYg==";
      const szOwner = 'lance-loong';
      const szRepository = 'WeeklyGym';
      const szDatabaseName = 'database';
      const pDatabase = new CGithubDatabase( atob( szBase64 ), szOwner, szRepository, szDatabaseName );
      this.m_pDatabase = pDatabase;

      const This = this;
      pDatabase.Connect().then( function( data ){
        return pDatabase.GetAllData();
      }, function( errors ){
        This.DialogError( errors );
      } ).then( function( data ){
        var tbl = [];
        for( var i = 0; i < data.length; ++i )
          tbl.push( data[i] );
        This.tableData = tbl;
      }, function( errors ){
        This.DialogError( errors );
      } );
    }
  }
</script>

<style scoped>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
