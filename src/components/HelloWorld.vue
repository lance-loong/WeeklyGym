<template>
  <div class=block>
    <h1>统计数据</h1>
    <el-table :data="tableStatistics" stripe style="width: 100%">
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="join_date" label="加入时间" width="180"></el-table-column>
      <el-table-column prop="train_total" label="总运动次数" width="180"></el-table-column>
      <el-table-column prop="train_cur_week" label="当前周运动次数" width="180"></el-table-column>
      <el-table-column prop="amount" label="当前周贡献金额" width="180"></el-table-column>
      <el-table-column prop="amount_total" label="总贡献金额" width="180"></el-table-column>
      <el-table-column prop="achievement_percentage" label="成就度" width="180"></el-table-column>
      <el-table-column prop="achievement_percentage_total" label="总成就度"></el-table-column>
    </el-table>
    <el-divider></el-divider>

    <h1>添加数据</h1>
    <el-row :gutter="20">
      <el-col :span="6"><el-input v-model="AddName" placeholder="名字"></el-input></el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="AddDate"
          align="right"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-col>
      <el-col :span="6"><el-input v-model="AddGym" placeholder="运动"></el-input></el-col>
      <el-col :span="6"><el-button @click="handleClickAdd( AddName, AddDate, AddGym )">添加运动记录</el-button></el-col>
    </el-row>

    <el-divider></el-divider>

    <h1>数据列表</h1>
    <el-table :data="tableData" stripe style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="data.name" label="姓名" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.data.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="data.date" label="时间" width="250">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.data.date"
            :clearable="false"
            align="right"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="data.activity" label="活动" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClickDel(scope.row)" type="text" size="small">删除</el-button>
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
      tableRowClassName({row, rowIndex}) {
        if( rowIndex == 0 )
          return '';
        if( rowIndex % 2 == 0 )
          return 'warning-row';
        else
          return 'success-row';
      },
      handleClickDel( data )
      {
        const This = this;
        const pDatabase = this.m_pDatabase;
        pDatabase.DelData( data.id ).then( function() {
          const i = This.tableData.indexOf( data );
          This.tableData.splice( i, 1 );
        }, function( errors ) {
          This.DialogError( errors );
        } );
      },
      handleClickAdd( AddName, AddDate, AddGym )
      {
        const This = this;
        const pDatabase = this.m_pDatabase;
        const data =
        {
          name : AddName,
          date : AddDate,
          activity : AddGym,
        };
        pDatabase.AddData( data ).then( function( data ){
          This.tableData.push( data );
        }, function( errors ){
          This.DialogError( errors );
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
      }
    },
    data() {
      return {
        pDialog : {
          visible : false,
          message : '',
        },
        AddDate: '2020-01-09T13:30:35.863Z',
        AddName : '',
        AddGym : '',
        tableData : [],
        tableStatistics : [],
      }
    },
    watch : {
      tableData( val )
      {
        var tableData = this.tableData;
        var statistics = {};
        for( var i = 0; i < tableData.length; ++i )
        {
          var name = tableData[i].data.name;
          var date = tableData[i].data.date;
          var activity = tableData[i].data.activity;

          if( !statistics[name] )
          {
            statistics[name] =
            {
              name : '',
              join_date : '',
              train_total : 0,
              train_cur_week : 0,
              amount : 0,
              amount_total : 0,
              achievement_percentage : '',
              achievement_percentage_total : '',
            };
          }

          ++statistics[name].train_total;
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
              week_num : "1",
              year : "2019",
            },
            updatedAt : '',
          }
       */
      const szToken = '093db1900b1f076c47733fbf000c44749162c04f';
      const szOwner = 'lance-loong';
      const szRepository = 'WeeklyGym';
      const szDatabaseName = 'database';
      const pDatabase = new CGithubDatabase( szToken, szOwner, szRepository, szDatabaseName );
      this.m_pDatabase = pDatabase;

      const This = this;
      pDatabase.Connect().then( function( data ){
        return pDatabase.GetAllData();
      }, function( errors ){
        This.DialogError( errors );
      } ).then( function( data ){
        for( var i = 0; i < data.length; ++i )
          This.tableData.push( data[i] );
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
