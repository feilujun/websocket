/*
 * @Author: 刘文柱 
 * @Date: 2018-10-18 10:09:13 
 * @Last Modified by: 刘文柱
 * @Last Modified time: 2020-06-28 15:53:40
 */
import en_US from './en_US.js';
import zhCN from './zh_CN.js';
import { language } from "quant-ui";
const { setData, en, zh } = language;
setData(en, en_US);
setData(zh, zhCN);