<template>
  <div id="app">
    <vue-progress-bar />
    <notifications style="top:55px" />
    <router-view />
  </div>
</template>

<script lang="ts">
import script from '.';
export default script;
</script>

<style>
html,
body,
.container-table {
  height: 100%;
  background-color: #282b30 !important;
  padding-right: 0 !important;
}
.content-wrapper {
  min-height: calc(100vh - 51px);
}
.container-table {
  display: table;
  color: white;
}
.vertical-center-row {
  display: table-cell;
  vertical-align: middle;
}
.vertical-20p {
  padding-top: 20%;
}
.vertical-10p {
  padding-top: 10%;
}
.vertical-5p {
  padding-top: 5%;
}
.logo {
  width: 15em;
  padding: 3em;
}
.hidden {
  display: none;
}

.bar-primary,
.bar-active,
.bar-inactive,
.bar-warning,
.bar-danger,
.bar-info {
  border-radius: 5px;
  text-align: center;
}
.bar-primary {
  background-color: #3c8dbc !important;
  color: #fff;
}
.bar-warning {
  background-color: #ffc107 !important;
}
.bar-active {
  background-color: #28a745 !important;
  color: #fff;
}
.bar-inactive {
  background-color: #6c757d !important;
}
.bar-danger {
  background-color: #dc3545 !important;
  color: #fff;
}
.bar-info {
  background-color: #5bc0de !important;
  color: #fff;
}

.text-success {
  color: #28a745 !important;
}
.text-warning {
  color: #ffc107 !important;
}
.text-danger {
  color: #dc3545 !important;
}
.font-weight-bold {
  font-weight: 700 !important;
}
@import url('/static/css/dataTables.bootstrap.min.css');
table.dataTable thead .sorting:after,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc:after {
  font-family: 'FontAwesome';
}
table.dataTable thead .sorting:after {
  content: '\f0dc';
}
table.dataTable thead .sorting_asc:after {
  content: '\f0dd';
}
table.dataTable thead .sorting_desc:after {
  content: '\f0de';
}
.dataTable-controls-right {
  float: right !important;
}
@media only screen and (max-width: 767px) {
  .dataTable-controls-right {
    float: none !important;
  }
}
.dataTable-controls-btnNew {
  margin-left: 20px;
  text-align: center;
}
.dataTable-controls-btnNew .dt-buttons .dt-button {
  margin-bottom: 5px;
}
.dataTables_length label select,
.dataTables_filter label input {
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
a {
  cursor: pointer;
}
.btn-disabled {
  cursor: auto;
}
.submit {
  display: block;
  width: 40%;
  margin: 0 auto;
}
.mt {
  margin-top: 20px;
}
.mb {
  margin-bottom: 20px;
}

.topBar {
  display: flex;
  justify-content: space-between;
}
.tabs div {
  margin-right: 2px;
}
.tabs-right div {
  margin-left: 2px;
}
.tab {
  border: 1px solid #ccc;
  border-bottom: none;
  display: inline-block;
  width: 100px;
  text-align: center;
  white-space: nowrap;
}
.tabon {
  border-bottom-color: #ddd !important;
  background-color: #ddd;
  padding: 5px 19px;
}
.taboff,
.run {
  cursor: pointer;
  padding: 5px 19px;
}
.taboff:hover {
  background-color: #eee;
}
.transparent {
  background-color: transparent !important;
}
.CodeMirror {
  /* Bootstrap Settings */
  box-sizing: border-box;
  margin: 0;
  font: inherit;
  overflow: auto;
  font-family: inherit;
  display: block;
  height: 500px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  /* Code Mirror Settings */
  font-family: monospace;
  position: relative;
  overflow: hidden;
}
.CodeMirror-focused {
  /* Bootstrap Settings */
  border-color: #66afe9;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
/*
.show {
  display: inline-block!important;
}
*/
.chart-legend {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.chart-legend li {
  display: inline-block;
  padding: 0 5px;
}

.chart-legend li.hidden {
  text-decoration: line-through;
}

.chart-legend li span {
  border-radius: 5px;
  display: inline-block;
  height: 10px;
  width: 10px;
}
</style>
