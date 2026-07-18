import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

/* ================= DATA (embedded from CSV export) ================= */
const DEFAULT_RAW_DAYS = [{"marcados":39,"livres":2,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":41,"data":"2026-07-20"},{"marcados":33,"livres":0,"feriado":0,"bloqueio_outros":3,"reservado":0,"total_slots":36,"data":"2026-07-27"},{"marcados":36,"livres":0,"feriado":0,"bloqueio_outros":9,"reservado":0,"total_slots":45,"data":"2026-08-03"},{"marcados":32,"livres":5,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":40,"data":"2026-08-10"},{"marcados":27,"livres":7,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":37,"data":"2026-08-17"},{"marcados":31,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":34,"data":"2026-08-24"},{"marcados":31,"livres":4,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":38,"data":"2026-08-31"},{"marcados":0,"livres":0,"feriado":20,"bloqueio_outros":0,"reservado":0,"total_slots":20,"data":"2026-09-07"},{"marcados":36,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":39,"data":"2026-09-14"},{"marcados":33,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":36,"data":"2026-09-21"},{"marcados":32,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":35,"data":"2026-09-28"},{"marcados":31,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":34,"data":"2026-10-05"},{"marcados":0,"livres":0,"feriado":20,"bloqueio_outros":0,"reservado":0,"total_slots":20,"data":"2026-10-12"},{"marcados":31,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":34,"data":"2026-10-19"},{"marcados":30,"livres":1,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":34,"data":"2026-10-26"},{"marcados":0,"livres":0,"feriado":20,"bloqueio_outros":0,"reservado":0,"total_slots":20,"data":"2026-11-02"},{"marcados":30,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":33,"data":"2026-11-09"},{"marcados":29,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":32,"data":"2026-11-16"},{"marcados":27,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":30,"data":"2026-11-23"},{"marcados":23,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":26,"data":"2026-11-30"},{"marcados":0,"livres":0,"feriado":20,"bloqueio_outros":0,"reservado":0,"total_slots":20,"data":"2026-12-07"},{"marcados":36,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":39,"data":"2026-12-14"},{"marcados":23,"livres":1,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":27,"data":"2026-12-21"},{"marcados":11,"livres":7,"feriado":0,"bloqueio_outros":0,"reservado":3,"total_slots":21,"data":"2026-12-28"},{"marcados":8,"livres":8,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":16,"data":"2027-01-04"},{"marcados":18,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":18,"data":"2027-01-11"},{"marcados":11,"livres":4,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":15,"data":"2027-01-18"},{"marcados":5,"livres":9,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":14,"data":"2027-01-25"},{"marcados":3,"livres":8,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":11,"data":"2027-02-01"},{"marcados":1,"livres":0,"feriado":10,"bloqueio_outros":0,"reservado":0,"total_slots":11,"data":"2027-02-08"},{"marcados":7,"livres":4,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":11,"data":"2027-02-15"},{"marcados":7,"livres":4,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":11,"data":"2027-02-22"},{"marcados":3,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":3,"data":"2027-03-15"},{"marcados":1,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":1,"data":"2027-03-29"},{"marcados":1,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":1,"data":"2027-04-05"},{"marcados":2,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":2,"data":"2027-04-12"},{"marcados":1,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":1,"data":"2027-04-19"},{"marcados":1,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":1,"data":"2027-05-03"},{"marcados":4,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":4,"data":"2027-05-10"},{"marcados":4,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":4,"data":"2027-06-07"},{"marcados":1,"livres":0,"feriado":0,"bloqueio_outros":0,"reservado":0,"total_slots":1,"data":"2027-06-14"}];

const DEFAULT_RAW_APPTS = [{"data":"2026-07-20","hora":"00:00","prontuario":"7735269","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"00:00","prontuario":"2533867","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"7594690","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"4052882","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"6344196","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"45988854","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"7113434","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"46171021","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"07:00","prontuario":"2855229","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"10153906","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"07:00","prontuario":"46173878","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"45597648","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"46325106","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"7099203","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:00","prontuario":"10082931","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"07:30","prontuario":"3025178","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"08:00","prontuario":"3126760","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"08:00","prontuario":"7035702","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"08:30","prontuario":"2628261","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"08:30","prontuario":"6705826","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"08:58","prontuario":"46787172","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"09:00","prontuario":"7291073","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"09:00","prontuario":"6327464","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"09:30","prontuario":"46365946","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"09:30","prontuario":"4449005","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"10:00","prontuario":"46018214","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"10:00","prontuario":"46171658","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"10:30","prontuario":"6071286","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"10:30","prontuario":"2615920","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"10:38","prontuario":"46059218","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"10:53","prontuario":"7315989","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"11:00","prontuario":"10330423","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"11:00","prontuario":"6199061","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"11:30","prontuario":"46077004","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"11:30","prontuario":"7030778","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"11:46","prontuario":"46382917","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-20","hora":"11:52","prontuario":"46687471","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"13:00","prontuario":"6065577","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-20","hora":"13:45","prontuario":"46245999","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"00:00","prontuario":"8254997","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"4421673","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"46238291","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"07:00","prontuario":"46768099","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"5101597","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"46244828","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"10040178","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"07:00","prontuario":"522102","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"07:00","prontuario":"46940490","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"46897427","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"07:00","prontuario":"46260410","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"6186084","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"46158358","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:00","prontuario":"8346363","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"07:30","prontuario":"7854474","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:30","prontuario":"45508074","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"07:30","prontuario":"45741857","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"08:00","prontuario":"46008074","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"08:00","prontuario":"45594264","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"08:30","prontuario":"45619376","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"08:30","prontuario":"45981651","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"09:00","prontuario":"5491550","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"09:00","prontuario":"5192703","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"09:30","prontuario":"7474331","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"09:30","prontuario":"7401334","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"10:00","prontuario":"6686430","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"10:00","prontuario":"46192845","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"10:30","prontuario":"45434644","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"10:30","prontuario":"45934767","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"10:50","prontuario":"46735882","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"11:00","prontuario":"46480729","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-07-27","hora":"11:30","prontuario":"7570062","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-07-27","hora":"11:30","prontuario":"4796207","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"00:00","prontuario":"5855978","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"00:00","prontuario":"45554953","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"00:00","prontuario":"8216046","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"00:00","prontuario":"7269160","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"10052033","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"45417912","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"46922514","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"07:00","prontuario":"8188971","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"4034880","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"4027348","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"45988854","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"10253110","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"07:00","prontuario":"46984449","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"07:00","prontuario":"45920105","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"8110710","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"7413032","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:00","prontuario":"4464657","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"07:00","prontuario":"46975306","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"07:30","prontuario":"45472727","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"07:31","prontuario":"6225999","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"08:00","prontuario":"7304694","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"08:00","prontuario":"7860729","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"08:00","prontuario":"8322372","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"08:30","prontuario":"6844138","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"08:44","prontuario":"46189783","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"09:00","prontuario":"7365059","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"09:00","prontuario":"46789921","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"09:30","prontuario":"46792164","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"09:47","prontuario":"45795705","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"09:52","prontuario":"4803235","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"10:00","prontuario":"6630958","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"10:30","prontuario":"5567433","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"10:49","prontuario":"46438529","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"10:52","prontuario":"10277366","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-03","hora":"11:30","prontuario":"45826617","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-03","hora":"16:43","prontuario":"46245999","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"00:00","prontuario":"8339319","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"00:00","prontuario":"10043115","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"00:00","prontuario":"8339319","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"00:00","prontuario":"7001951","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:00","prontuario":"46649208","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"07:00","prontuario":"6067102","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"07:00","prontuario":"4217626","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"07:00","prontuario":"45482155","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"07:00","prontuario":"46514253","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:00","prontuario":"5104807","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:00","prontuario":"7514847","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:00","prontuario":"5026794","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:00","prontuario":"7971625","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:00","prontuario":"10214450","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:00","prontuario":"46796587","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:30","prontuario":"7186885","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"07:30","prontuario":"5771415","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"08:00","prontuario":"46035929","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"08:00","prontuario":"10044923","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"08:30","prontuario":"46503934","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"08:30","prontuario":"46998787","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"09:00","prontuario":"46062097","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"09:00","prontuario":"45783453","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"09:04","prontuario":"8119182","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"09:30","prontuario":"10158806","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"09:36","prontuario":"46357190","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"10:00","prontuario":"7328479","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"10:30","prontuario":"46077186","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"10:50","prontuario":"5757737","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"10:58","prontuario":"46482592","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-10","hora":"11:05","prontuario":"46794905","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-10","hora":"11:30","prontuario":"45585239","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"00:00","prontuario":"10043115","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-17","hora":"00:00","prontuario":"7055486","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"00:00","prontuario":"46817524","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"07:00","prontuario":"8021511","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"07:00","prontuario":"46858601","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"07:00","prontuario":"45472511","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"07:00","prontuario":"45658911","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-17","hora":"07:00","prontuario":"5803572","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-17","hora":"07:00","prontuario":"46610366","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"07:00","prontuario":"46059218","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"07:00","prontuario":"10173565","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-17","hora":"07:00","prontuario":"46002499","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-17","hora":"07:30","prontuario":"46508123","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"07:30","prontuario":"10134898","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-17","hora":"08:00","prontuario":"46171526","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"08:00","prontuario":"46652186","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-17","hora":"08:30","prontuario":"3982584","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"09:00","prontuario":"3868239","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"09:30","prontuario":"3767605","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"09:50","prontuario":"6244347","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"09:59","prontuario":"5866579","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"10:00","prontuario":"46149944","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"10:00","prontuario":"8415788","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"10:30","prontuario":"1514793","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"10:42","prontuario":"10304335","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"11:30","prontuario":"46091419","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-17","hora":"13:18","prontuario":"46253506","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"00:00","prontuario":"5853007","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"00:00","prontuario":"46571386","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"00:00","prontuario":"7347180","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"00:00","prontuario":"45975240","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"00:00","prontuario":"8137283","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"00:00","prontuario":"46150629","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"07:00","prontuario":"7777881","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"07:00","prontuario":"5002670","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"07:00","prontuario":"5987805","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"07:00","prontuario":"10041457","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"07:30","prontuario":"45633351","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"08:00","prontuario":"7626484","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"08:00","prontuario":"46998902","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"08:00","prontuario":"46059184","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"08:00","prontuario":"8309650","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"08:30","prontuario":"7355167","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"08:30","prontuario":"10330457","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"08:46","prontuario":"46800082","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"09:00","prontuario":"45488632","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"09:00","prontuario":"3429693","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"09:30","prontuario":"45508074","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"09:30","prontuario":"10090041","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"10:00","prontuario":"46351920","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"10:00","prontuario":"5154901","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"10:18","prontuario":"4402038","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"10:30","prontuario":"46819413","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"10:30","prontuario":"6244347","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"11:00","prontuario":"46202339","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"11:30","prontuario":"7079635","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-24","hora":"11:30","prontuario":"3886876","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-24","hora":"11:58","prontuario":"3336146","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"00:00","prontuario":"7197601","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"46238945","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"07:00","prontuario":"46018297","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"07:00","prontuario":"3219938","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"07:00","prontuario":"10339059","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"8108052","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"07:00","prontuario":"4433553","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"07:00","prontuario":"46687471","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"7073885","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"3399698","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"7167760","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"46297719","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"07:00","prontuario":"45925500","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"45444353","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"45397304","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"07:00","prontuario":"46487294","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"07:30","prontuario":"45915550","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"08:00","prontuario":"7855067","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"08:00","prontuario":"46038436","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"08:00","prontuario":"8188583","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"08:30","prontuario":"46405437","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"08:30","prontuario":"10188613","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"09:00","prontuario":"8144396","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"09:30","prontuario":"4533287","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"09:30","prontuario":"6863369","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"09:54","prontuario":"4910568","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"10:00","prontuario":"4116588","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"10:30","prontuario":"5574082","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-08-31","hora":"10:30","prontuario":"45677382","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"11:20","prontuario":"45814464","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-08-31","hora":"11:30","prontuario":"4410429","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"00:00","prontuario":"10055184","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"7317068","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"8342180","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"6306658","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"4003406","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"8181729","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"10327619","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"45630274","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"8043184","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"45799319","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:00","prontuario":"4308839","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:16","prontuario":"5044268","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:30","prontuario":"10301117","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"07:30","prontuario":"46049789","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"07:30","prontuario":"45606779","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"08:00","prontuario":"46953279","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"08:00","prontuario":"45934221","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"08:30","prontuario":"46532990","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"08:30","prontuario":"7788680","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"08:41","prontuario":"6981617","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"09:00","prontuario":"46453940","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"09:00","prontuario":"8211823","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"09:30","prontuario":"5217138","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"09:30","prontuario":"45730710","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"09:38","prontuario":"6554844","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"10:00","prontuario":"46951505","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"10:00","prontuario":"46024154","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"10:29","prontuario":"6695704","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"10:30","prontuario":"4123857","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"10:30","prontuario":"3435625","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"11:00","prontuario":"10224335","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"11:22","prontuario":"2662823","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"11:30","prontuario":"7542749","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-14","hora":"11:30","prontuario":"4544052","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"12:35","prontuario":"46984449","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-14","hora":"13:19","prontuario":"45444353","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"00:00","prontuario":"4201018","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"45582145","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"6997589","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"6737191","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"45877743","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"45472511","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"7757214","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"46071775","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"3908340","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"6811871","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"46008074","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"07:00","prontuario":"7432735","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:00","prontuario":"45925914","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"07:16","prontuario":"46235909","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"07:30","prontuario":"3219938","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"08:00","prontuario":"4671079","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"08:00","prontuario":"1761824","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"08:30","prontuario":"46573804","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"08:30","prontuario":"7247489","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"09:00","prontuario":"6023477","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"09:00","prontuario":"46400891","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"09:16","prontuario":"46760153","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"09:30","prontuario":"8179483","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"09:30","prontuario":"4478699","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"10:00","prontuario":"10106011","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"10:00","prontuario":"45635877","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"10:30","prontuario":"7573777","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"10:30","prontuario":"1932797","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"10:59","prontuario":"46482592","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"11:00","prontuario":"3904729","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"11:30","prontuario":"4769154","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-21","hora":"11:30","prontuario":"46091393","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-21","hora":"15:17","prontuario":"46884433","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"00:00","prontuario":"5813365","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"00:00","prontuario":"45939782","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"46057568","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"46467064","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"07:00","prontuario":"6709018","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"07:00","prontuario":"4513958","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"6051098","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"07:00","prontuario":"5044391","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"45517927","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"10257400","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"46245999","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"46727194","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"07:00","prontuario":"4927687","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"7202609","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:00","prontuario":"7180433","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"07:30","prontuario":"46112736","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"07:30","prontuario":"45741857","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"08:00","prontuario":"45899556","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"08:00","prontuario":"46883112","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"08:30","prontuario":"46037040","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"08:30","prontuario":"1932797","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"09:00","prontuario":"2733863","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"09:00","prontuario":"2724870","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"09:30","prontuario":"4216131","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"09:30","prontuario":"45668464","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"10:00","prontuario":"6955249","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"10:00","prontuario":"8119182","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"10:30","prontuario":"45441094","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"10:30","prontuario":"45991312","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-09-28","hora":"11:00","prontuario":"2921559","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"11:30","prontuario":"46735882","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-09-28","hora":"11:30","prontuario":"7833643","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"00:00","prontuario":"8194474","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"00:00","prontuario":"45961976","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"00:00","prontuario":"8085540","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"07:00","prontuario":"3953213","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"07:00","prontuario":"4790697","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"07:00","prontuario":"45619376","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"07:00","prontuario":"46467056","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"07:00","prontuario":"7538432","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"07:00","prontuario":"1734912","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"07:00","prontuario":"47006564","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"07:00","prontuario":"46072070","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"07:00","prontuario":"46634077","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"07:00","prontuario":"46494209","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"07:00","prontuario":"45513363","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"07:30","prontuario":"46223327","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"08:00","prontuario":"46159695","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"08:00","prontuario":"4149209","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"08:30","prontuario":"5288451","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"08:30","prontuario":"46277919","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"09:00","prontuario":"6705347","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"09:00","prontuario":"10351047","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"09:30","prontuario":"4464657","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"09:30","prontuario":"7749229","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"09:31","prontuario":"46112108","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"10:00","prontuario":"46953279","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"10:00","prontuario":"4903308","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"10:30","prontuario":"45907185","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"10:30","prontuario":"10390466","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-05","hora":"11:00","prontuario":"46654331","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"11:30","prontuario":"46163424","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-05","hora":"11:30","prontuario":"8146409","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"06:54","prontuario":"46171872","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"06:59","prontuario":"45783453","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"07:00","prontuario":"7988686","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"07:00","prontuario":"4217626","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"07:00","prontuario":"45994779","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"07:00","prontuario":"46131645","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"07:00","prontuario":"10253110","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"07:00","prontuario":"46820312","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"07:00","prontuario":"46506945","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"07:00","prontuario":"45472511","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"07:00","prontuario":"5719083","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"07:00","prontuario":"6225999","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"07:30","prontuario":"6106835","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"08:00","prontuario":"7784911","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"08:00","prontuario":"4882965","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"08:30","prontuario":"46117313","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"08:30","prontuario":"46365946","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"09:00","prontuario":"6702708","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"09:00","prontuario":"45570033","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"09:30","prontuario":"4812756","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"09:30","prontuario":"5952742","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"10:00","prontuario":"46532990","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"10:00","prontuario":"46480877","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"10:30","prontuario":"8346363","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"10:30","prontuario":"45441250","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"11:00","prontuario":"5769245","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"11:22","prontuario":"46311874","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"11:30","prontuario":"46171021","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"11:30","prontuario":"45882198","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-19","hora":"12:22","prontuario":"45743325","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-19","hora":"13:00","prontuario":"1811546","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"00:00","prontuario":"5815204","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"00:00","prontuario":"4873741","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"00:00","prontuario":"5691258","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"00:00","prontuario":"1660117","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"06:51","prontuario":"45564093","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"07:00","prontuario":"6002919","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"07:00","prontuario":"45924073","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"07:00","prontuario":"45641511","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"07:00","prontuario":"46825592","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"07:00","prontuario":"5171129","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"07:00","prontuario":"46087243","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"07:00","prontuario":"752733","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"07:00","prontuario":"5142864","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"07:00","prontuario":"45397304","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"07:30","prontuario":"3663911","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"08:00","prontuario":"46260410","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"08:30","prontuario":"46238291","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"08:30","prontuario":"2161222","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"09:00","prontuario":"46482592","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"09:00","prontuario":"46829214","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"09:30","prontuario":"3564440","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"09:30","prontuario":"46228516","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"10:00","prontuario":"7187743","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"10:00","prontuario":"5851100","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"10:30","prontuario":"7309032","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"10:30","prontuario":"46607206","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"11:00","prontuario":"10367118","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"11:30","prontuario":"10041457","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-10-26","hora":"11:30","prontuario":"7971625","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-10-26","hora":"12:35","prontuario":"46984449","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"07:00","prontuario":"46754040","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"07:00","prontuario":"46214466","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"07:00","prontuario":"45657830","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"07:00","prontuario":"6588834","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"07:00","prontuario":"45472511","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"07:00","prontuario":"5128186","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"07:00","prontuario":"6225999","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"07:00","prontuario":"5154141","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"07:00","prontuario":"46208518","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"07:00","prontuario":"46579801","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"07:05","prontuario":"7952740","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"07:30","prontuario":"8209959","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"07:30","prontuario":"2972198","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"07:50","prontuario":"8080889","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"08:00","prontuario":"46651998","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"08:00","prontuario":"46487443","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"08:30","prontuario":"6686984","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"08:30","prontuario":"6255491","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"09:00","prontuario":"7591027","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"09:00","prontuario":"6558886","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"09:14","prontuario":"10138451","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"09:30","prontuario":"1128792","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"09:30","prontuario":"4821609","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"10:00","prontuario":"46778825","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"10:00","prontuario":"46485140","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"10:30","prontuario":"46794905","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-09","hora":"10:30","prontuario":"10089068","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"11:00","prontuario":"6721971","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"11:30","prontuario":"5913595","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-09","hora":"11:30","prontuario":"46868261","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:00","prontuario":"8144396","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"07:00","prontuario":"7987670","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:00","prontuario":"6065577","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:00","prontuario":"10394229","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:00","prontuario":"46922514","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"07:00","prontuario":"45595311","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:00","prontuario":"4141230","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:00","prontuario":"7106206","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"07:00","prontuario":"46276309","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:00","prontuario":"45772852","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:00","prontuario":"46035929","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:30","prontuario":"2431930","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"07:30","prontuario":"46107157","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"08:00","prontuario":"8415788","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"08:00","prontuario":"46409108","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"08:30","prontuario":"10150563","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"08:30","prontuario":"7289879","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"09:00","prontuario":"7452600","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"09:00","prontuario":"45984093","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"09:30","prontuario":"46002499","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"09:30","prontuario":"8364929","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"10:00","prontuario":"8050361","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"10:00","prontuario":"2172492","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"10:20","prontuario":"7403884","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"10:30","prontuario":"4691903","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"10:30","prontuario":"45877057","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-16","hora":"11:00","prontuario":"6116842","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"11:30","prontuario":"45445327","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-16","hora":"11:30","prontuario":"45839230","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"00:00","prontuario":"10350262","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"00:00","prontuario":"7843568","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"00:00","prontuario":"45925914","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"07:00","prontuario":"4925657","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"07:00","prontuario":"8179483","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"07:00","prontuario":"45508074","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"07:00","prontuario":"7184237","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"07:00","prontuario":"45446283","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"07:00","prontuario":"7758170","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"07:30","prontuario":"3580461","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"08:00","prontuario":"46121794","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"08:00","prontuario":"10139939","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"08:30","prontuario":"46885919","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"08:30","prontuario":"6321251","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"09:00","prontuario":"45938362","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"09:00","prontuario":"46979183","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"09:30","prontuario":"7380777","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"09:30","prontuario":"46975421","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"10:00","prontuario":"8108052","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"10:00","prontuario":"46649224","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"10:19","prontuario":"7435456","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"10:30","prontuario":"10296648","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"10:30","prontuario":"46474482","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-23","hora":"11:00","prontuario":"46482592","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"11:00","prontuario":"5803572","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"11:30","prontuario":"10109866","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-23","hora":"11:30","prontuario":"46980710","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"00:00","prontuario":"3772233","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"07:00","prontuario":"10238400","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"07:00","prontuario":"10040178","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"07:00","prontuario":"5212980","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"07:00","prontuario":"46487294","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"07:00","prontuario":"7099203","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"07:00","prontuario":"45657830","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"07:30","prontuario":"6659866","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"08:00","prontuario":"46564399","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"08:00","prontuario":"6936165","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"08:30","prontuario":"10188613","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"08:30","prontuario":"46303384","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"09:00","prontuario":"46571386","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"09:00","prontuario":"6053805","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"09:30","prontuario":"46958344","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"09:30","prontuario":"4683496","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"10:00","prontuario":"8140857","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"10:00","prontuario":"3170347","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"10:30","prontuario":"8410896","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"10:30","prontuario":"46767729","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-11-30","hora":"11:00","prontuario":"7055486","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"11:30","prontuario":"7429301","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-11-30","hora":"11:30","prontuario":"46209334","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"06:59","prontuario":"45582145","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:00","prontuario":"3904729","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"07:00","prontuario":"45635877","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"07:00","prontuario":"6306658","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:00","prontuario":"7573777","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"07:00","prontuario":"6737191","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:00","prontuario":"46345641","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"07:00","prontuario":"46216628","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"07:00","prontuario":"4671079","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"07:00","prontuario":"5072376","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:00","prontuario":"45953098","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"07:00","prontuario":"46008074","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:00","prontuario":"45633351","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:00","prontuario":"7980436","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:00","prontuario":"45925914","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:30","prontuario":"45606779","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"07:30","prontuario":"3811189","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"07:50","prontuario":"10096956","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"08:00","prontuario":"10043859","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"08:00","prontuario":"6026462","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"08:00","prontuario":"4971362","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"08:30","prontuario":"5869375","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"08:30","prontuario":"7561566","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"09:00","prontuario":"10275485","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"09:00","prontuario":"7822406","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"09:30","prontuario":"10158806","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"09:30","prontuario":"45926334","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"10:00","prontuario":"5138052","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"10:00","prontuario":"45398807","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"10:30","prontuario":"46734406","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"10:30","prontuario":"46654331","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"10:35","prontuario":"10314847","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"11:00","prontuario":"6610281","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"11:30","prontuario":"46992301","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-14","hora":"11:30","prontuario":"46992947","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-14","hora":"12:00","prontuario":"10356186","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"07:00","prontuario":"7545049","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"07:30","prontuario":"8284630","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"08:00","prontuario":"46984449","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"08:00","prontuario":"46296919","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"08:30","prontuario":"7403884","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"08:30","prontuario":"6737191","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"09:00","prontuario":"46360715","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"09:00","prontuario":"45862554","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"09:06","prontuario":"8123879","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"09:30","prontuario":"46646915","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"09:30","prontuario":"46830915","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"09:37","prontuario":"6554844","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"09:38","prontuario":"7516495","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"10:00","prontuario":"6870273","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"10:00","prontuario":"10055184","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"10:02","prontuario":"46260782","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"10:30","prontuario":"45975240","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"10:30","prontuario":"10089183","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"10:50","prontuario":"46735882","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"11:00","prontuario":"5128186","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"11:01","prontuario":"46482592","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-21","hora":"11:30","prontuario":"7830425","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-21","hora":"12:22","prontuario":"6068043","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-28","hora":"07:00","prontuario":"5181003","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-28","hora":"07:00","prontuario":"8085540","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-28","hora":"07:30","prontuario":"6811871","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-28","hora":"08:00","prontuario":"46341996","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-28","hora":"08:00","prontuario":"6666044","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-28","hora":"08:30","prontuario":"4509949","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-28","hora":"09:00","prontuario":"45921228","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-28","hora":"10:00","prontuario":"3245313","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-28","hora":"10:30","prontuario":"10028439","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2026-12-28","hora":"10:30","prontuario":"10292746","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2026-12-28","hora":"11:30","prontuario":"7980436","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-04","hora":"07:00","prontuario":"7202609","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-04","hora":"07:00","prontuario":"46096459","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-04","hora":"07:30","prontuario":"1557602","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-04","hora":"08:00","prontuario":"7379308","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-04","hora":"09:03","prontuario":"7760747","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-04","hora":"09:39","prontuario":"46924262","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-04","hora":"10:13","prontuario":"5905450","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-04","hora":"10:43","prontuario":"4970000","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"06:59","prontuario":"45619376","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"06:59","prontuario":"45513363","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-11","hora":"06:59","prontuario":"45783453","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-11","hora":"07:00","prontuario":"45482155","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"07:00","prontuario":"7422405","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"07:30","prontuario":"46202396","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"08:00","prontuario":"45664307","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"08:30","prontuario":"7695950","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"09:00","prontuario":"46733531","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"09:30","prontuario":"7074669","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"09:50","prontuario":"6734123","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"10:00","prontuario":"4781852","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"10:30","prontuario":"7157829","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"10:57","prontuario":"7192735","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"11:00","prontuario":"7540909","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"11:30","prontuario":"10195733","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-11","hora":"11:36","prontuario":"46311874","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-11","hora":"12:55","prontuario":"6177398","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-18","hora":"07:00","prontuario":"7757214","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-18","hora":"07:00","prontuario":"46171021","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-18","hora":"07:00","prontuario":"8148728","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-18","hora":"07:00","prontuario":"45870839","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-18","hora":"07:30","prontuario":"5272851","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-18","hora":"08:00","prontuario":"46819546","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-18","hora":"08:30","prontuario":"45699014","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-18","hora":"09:00","prontuario":"7085160","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-18","hora":"09:41","prontuario":"8110710","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-18","hora":"11:30","prontuario":"46926671","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-18","hora":"11:40","prontuario":"10205573","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-25","hora":"07:00","prontuario":"45859634","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-25","hora":"07:00","prontuario":"5873658","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-25","hora":"07:00","prontuario":"45594264","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-01-25","hora":"07:00","prontuario":"46708707","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-01-25","hora":"10:18","prontuario":"5905450","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-02-01","hora":"06:51","prontuario":"46171872","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-01","hora":"07:30","prontuario":"3236684","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-01","hora":"08:00","prontuario":"46276309","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-08","hora":"07:16","prontuario":"6646830","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-15","hora":"07:00","prontuario":"46922514","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-02-15","hora":"07:00","prontuario":"45492105","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-15","hora":"07:30","prontuario":"8141616","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-15","hora":"08:00","prontuario":"3555240","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-15","hora":"08:30","prontuario":"46797114","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-15","hora":"09:00","prontuario":"7143209","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-15","hora":"09:30","prontuario":"45953098","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-22","hora":"07:00","prontuario":"45513868","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-22","hora":"07:00","prontuario":"45475100","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-22","hora":"07:30","prontuario":"6051098","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-22","hora":"08:00","prontuario":"46227377","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-22","hora":"08:30","prontuario":"3777414","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-22","hora":"11:00","prontuario":"46239703","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-02-22","hora":"11:30","prontuario":"46234894","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-03-15","hora":"07:00","prontuario":"6654677","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-03-15","hora":"07:00","prontuario":"5888979","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-03-15","hora":"07:00","prontuario":"45885019","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-03-29","hora":"07:00","prontuario":"46833885","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-04-05","hora":"00:00","prontuario":"6656896","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-04-12","hora":"00:00","prontuario":"10192474","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-04-12","hora":"07:00","prontuario":"46050670","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-04-19","hora":"11:39","prontuario":"46311874","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-05-03","hora":"07:00","prontuario":"6703193","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-05-10","hora":"07:00","prontuario":"5827365","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-05-10","hora":"07:00","prontuario":"3966207","medico":"STENIO CERQUEIRA DE ATAIDE"},{"data":"2027-05-10","hora":"07:00","prontuario":"5858162","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-05-10","hora":"07:00","prontuario":"2737096","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-06-07","hora":"07:00","prontuario":"10289676","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-06-07","hora":"07:00","prontuario":"45480068","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-06-07","hora":"07:00","prontuario":"45843117","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-06-07","hora":"08:00","prontuario":"7208713","medico":"JOSE CESAR BATISTA OLIVEIRA FILHO"},{"data":"2027-06-14","hora":"07:00","prontuario":"8380263","medico":"STENIO CERQUEIRA DE ATAIDE"}];

/* ================= CSV IMPORT (weekly agenda update) ================= */
const REQUIRED_CSV_COLUMNS = ["Data/Hora", "Prontuário", "Profissional", "Sit"];

function readFileAsText(file, encoding) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsText(file, encoding);
  });
}

function parseCSVLine(line, delimiter) {
  const result = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === delimiter) { result.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  result.push(cur);
  return result;
}

function parseCSVText(text, delimiter = ";") {
  const clean = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = clean.split("\n").filter(l => l.length > 0);
  if (!lines.length) return { headers: [], rows: [] };
  const headers = parseCSVLine(lines[0], delimiter).map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const cells = parseCSVLine(line, delimiter);
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (cells[idx] ?? "").trim(); });
    return obj;
  });
  return { headers, rows };
}

function parseDataHoraCell(str) {
  const m = (str || "").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  if (!m) return null;
  const [, d, mo, y, hh, mm] = m;
  return { iso: `${y}-${mo}-${d}`, hora: `${hh}:${mm}` };
}

function cleanProntuarioCell(val) {
  if (!val) return "";
  return val.replace(/\.0$/, "").replace(/[^0-9]/g, "");
}

function buildAgendaFromRows(rows) {
  const dayMap = new Map();
  const appts = [];
  rows.forEach(r => {
    const dh = parseDataHoraCell(r["Data/Hora"]);
    if (!dh) return;
    const sit = (r["Sit"] || "").trim().toUpperCase();
    if (!dayMap.has(dh.iso)) {
      dayMap.set(dh.iso, { data: dh.iso, marcados: 0, livres: 0, feriado: 0, bloqueio_outros: 0, reservado: 0, total_slots: 0 });
    }
    const d = dayMap.get(dh.iso);
    d.total_slots += 1;
    if (sit === "M") {
      d.marcados += 1;
      const prontuario = cleanProntuarioCell(r["Prontuário"]);
      if (prontuario) {
        appts.push({
          data: dh.iso,
          hora: dh.hora,
          prontuario,
          medico: (r["Profissional"] || "").trim(),
        });
      }
    } else if (sit === "L") d.livres += 1;
    else if (sit === "F") d.feriado += 1;
    else if (sit === "O") d.bloqueio_outros += 1;
    else if (sit === "R") d.reservado += 1;
  });
  const days = Array.from(dayMap.values()).sort((a, b) => a.data.localeCompare(b.data));
  appts.sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  return { days, appts };
}

async function parseAgendaCSVFile(file) {
  const text = await readFileAsText(file, "windows-1252");
  const { headers, rows } = parseCSVText(text, ";");
  const missing = REQUIRED_CSV_COLUMNS.filter(c => !headers.includes(c));
  if (missing.length) {
    throw new Error(`O arquivo não tem as colunas esperadas (faltando: ${missing.join(", ")}). Exporte o CSV original do sistema, sem editar as colunas.`);
  }
  const { days, appts } = buildAgendaFromRows(rows);
  if (!days.length) {
    throw new Error("Não encontrei nenhuma data válida no arquivo. Confira se a coluna Data/Hora está no formato dd/mm/aaaa hh:mm.");
  }
  return {
    data: { days, appts },
    meta: {
      fileName: file.name,
      importedAt: new Date().toISOString(),
      totalRows: rows.length,
      totalMarcados: appts.length,
      totalDias: days.length,
    },
  };
}

const PUBLISHED_DATA_FILENAME = "agenda-dados.json";

function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function fetchPublishedAgenda() {
  try {
    const res = await fetch("./" + PUBLISHED_DATA_FILENAME, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.data?.days?.length) return null;
    return json;
  } catch (e) {
    return null;
  }
}

const MONTHS_PT = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const WEEKDAYS_PT = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];

function toTitleCase(str) {
  const small = new Set(["de","da","do","das","dos","e"]);
  return str.toLowerCase().split(" ").map((w,i) => small.has(w) && i!==0 ? w : (w.charAt(0).toUpperCase()+w.slice(1))).join(" ");
}

function parseISO(iso) {
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(y, m-1, d);
}

function formatDateLong(iso) {
  const dt = parseISO(iso);
  return `${dt.getDate().toString().padStart(2,"0")} de ${MONTHS_PT[dt.getMonth()]} de ${dt.getFullYear()}`;
}

function formatDateShort(iso) {
  const dt = parseISO(iso);
  return `${dt.getDate().toString().padStart(2,"0")}/${(dt.getMonth()+1).toString().padStart(2,"0")}/${dt.getFullYear()}`;
}

function weekdayOf(iso) {
  return WEEKDAYS_PT[parseISO(iso).getDay()];
}

function ddmmyyyyToISO(str) {
  // accepts dd/mm/yy or dd/mm/yyyy
  const parts = str.trim().split("/");
  if (parts.length !== 3) return null;
  let [d,m,y] = parts;
  if (y.length === 2) y = "20"+y;
  if (!d || !m || !y) return null;
  d = d.padStart(2,"0"); m = m.padStart(2,"0");
  return `${y}-${m}-${d}`;
}

const LIMIAR_SINALIZAR = 30;
const LIMIAR_OVERFLOW = 36;

function statusFor(marcados) {
  if (marcados >= LIMIAR_OVERFLOW) return "overflow";
  if (marcados >= LIMIAR_SINALIZAR) return "sinalizar";
  return "normal";
}

const STATUS_META = {
  normal:    { label: "Dentro do limite", color: "var(--ok)",   bg: "var(--ok-bg)" },
  sinalizar: { label: "Atenção — próximo do limite", color: "var(--warn)", bg: "var(--warn-bg)" },
  overflow:  { label: "Superlotação", color: "var(--danger)", bg: "var(--danger-bg)" },
};

const TIPO_AUSENCIA = ["Férias", "Abono", "Cobertura de Férias — Hemodiálise", "Licença"];

const DEFAULT_ABSENCES = [
  { id: "a1", medico: "Maria Tavares", tipo: "Abono", datas: ["2026-10-05"] },
  { id: "a2", medico: "Maria Tavares", tipo: "Cobertura de Férias — Hemodiálise", datas: ["2026-08-17", "2026-10-19"] },
  { id: "a3", medico: "Maria Tavares", tipo: "Férias", datas: ["2026-11-09", "2026-11-16", "2026-11-23"] },
];

/* ================= ICONS (inline, no deps) ================= */
const Icon = {
  Alert: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  Search: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Calendar: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  User: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Plus: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Trash: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  ChevronDown: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  Droplet: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69s-6 7.44-6 11.94a6 6 0 0 0 12 0c0-4.5-6-11.94-6-11.94Z"/></svg>),
  Stethoscope: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6"/><path d="M8 15a6 6 0 0 0 6-6V3a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><circle cx="20" cy="10" r="2"/><path d="M20 12v3a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4v-.5"/></svg>),
  X: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Upload: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>),
  File: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>),
  RotateCcw: (p) => (<svg viewBox="0 0 24 24" width={p.size||16} height={p.size||16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><polyline points="3 3 3 8 8 8"/></svg>),
};

/* ================= MAIN APP ================= */
const DEFAULT_AGENDA_META = { fileName: null, importedAt: null, totalRows: null, isDefault: true, source: "default" };

export default function App() {
  const [absences, setAbsences] = useState(DEFAULT_ABSENCES);
  const [tab, setTab] = useState("calendario");
  const [storageReady, setStorageReady] = useState(false);
  const [agendaData, setAgendaData] = useState({ days: DEFAULT_RAW_DAYS, appts: DEFAULT_RAW_APPTS });
  const [agendaMeta, setAgendaMeta] = useState(DEFAULT_AGENDA_META);

  // load persisted absences + agenda data (priority: local pending update > published file > sample data)
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage?.get?.("ausencias", false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          if (Array.isArray(parsed) && parsed.length) setAbsences(parsed);
        }
      } catch (e) {
        // no stored value yet — keep defaults
      }

      let loadedFromLocal = false;
      try {
        const dataRes = await window.storage?.get?.("agenda_dados", false);
        const metaRes = await window.storage?.get?.("agenda_meta", false);
        if (dataRes?.value && metaRes?.value) {
          const parsedData = JSON.parse(dataRes.value);
          const parsedMeta = JSON.parse(metaRes.value);
          if (parsedData?.days?.length) {
            setAgendaData(parsedData);
            setAgendaMeta({ ...parsedMeta, isDefault: false, source: "local" });
            loadedFromLocal = true;
          }
        }
      } catch (e) {
        // no local pending update — try published file next
      }

      if (!loadedFromLocal) {
        const published = await fetchPublishedAgenda();
        if (published?.data?.days?.length) {
          setAgendaData(published.data);
          setAgendaMeta({ ...published.meta, isDefault: false, source: "published" });
        }
      }

      setStorageReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    (async () => {
      try {
        await window.storage?.set?.("ausencias", JSON.stringify(absences), false);
      } catch (e) { /* ignore */ }
    })();
  }, [absences, storageReady]);

  const handleAgendaLoaded = useCallback((data, meta) => {
    setAgendaData(data);
    setAgendaMeta({ ...meta, isDefault: false, source: "local" });
    (async () => {
      try {
        await window.storage?.set?.("agenda_dados", JSON.stringify(data), false);
        await window.storage?.set?.("agenda_meta", JSON.stringify(meta), false);
      } catch (e) { /* ignore */ }
    })();
  }, []);

  const handlePublish = useCallback(() => {
    downloadJSON(PUBLISHED_DATA_FILENAME, { data: agendaData, meta: agendaMeta });
  }, [agendaData, agendaMeta]);

  const handleDiscardLocal = useCallback(() => {
    (async () => {
      try {
        await window.storage?.delete?.("agenda_dados", false);
        await window.storage?.delete?.("agenda_meta", false);
      } catch (e) { /* ignore */ }
      const published = await fetchPublishedAgenda();
      if (published?.data?.days?.length) {
        setAgendaData(published.data);
        setAgendaMeta({ ...published.meta, isDefault: false, source: "published" });
      } else {
        setAgendaData({ days: DEFAULT_RAW_DAYS, appts: DEFAULT_RAW_APPTS });
        setAgendaMeta(DEFAULT_AGENDA_META);
      }
    })();
  }, []);

  // map date -> list of absence entries active that date
  const absenceByDate = useMemo(() => {
    const map = {};
    absences.forEach(a => {
      a.datas.forEach(d => {
        if (!map[d]) map[d] = [];
        map[d].push(a);
      });
    });
    return map;
  }, [absences]);

  const days = useMemo(() => agendaData.days.slice().sort((a,b) => a.data.localeCompare(b.data)), [agendaData]);

  const totalMarcados = useMemo(() => days.reduce((s,d) => s + d.marcados, 0), [days]);
  const diasSinalizados = useMemo(() => days.filter(d => statusFor(d.marcados) === "sinalizar").length, [days]);
  const diasOverflow = useMemo(() => days.filter(d => statusFor(d.marcados) === "overflow").length, [days]);

  return (
    <div className="app">
      <style>{CSS}</style>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark"><Icon.Droplet size={20}/></span>
            <div className="brand-text">
              <div className="brand-title">Agenda &middot; Ambulatório de Nefrologia</div>
              <div className="brand-sub">Gestão de consultas &amp; ocupação da agenda</div>
            </div>
          </div>
          <div className="topbar-stats">
            <div className="stat">
              <span className="stat-value">{totalMarcados}</span>
              <span className="stat-label">consultas marcadas</span>
            </div>
            <div className="stat stat--warn">
              <span className="stat-value">{diasSinalizados}</span>
              <span className="stat-label">dias em atenção</span>
            </div>
            <div className="stat stat--danger">
              <span className="stat-value">{diasOverflow}</span>
              <span className="stat-label">dias superlotados</span>
            </div>
          </div>
        </div>
      </header>

      <main className="content">
        <AgendaUploadPanel meta={agendaMeta} onLoaded={handleAgendaLoaded} onPublish={handlePublish} onDiscardLocal={handleDiscardLocal} />
        <AbsencePanel absences={absences} setAbsences={setAbsences} />

        <nav className="tabs" role="tablist">
          <button role="tab" aria-selected={tab==="calendario"} className={"tab" + (tab==="calendario" ? " tab--active" : "")} onClick={() => setTab("calendario")}>
            <Icon.Calendar size={15}/> Visão geral da agenda
          </button>
          <button role="tab" aria-selected={tab==="busca"} className={"tab" + (tab==="busca" ? " tab--active" : "")} onClick={() => setTab("busca")}>
            <Icon.Search size={15}/> Buscar por prontuário
          </button>
          <button role="tab" aria-selected={tab==="data"} className={"tab" + (tab==="data" ? " tab--active" : "")} onClick={() => setTab("data")}>
            <Icon.Calendar size={15}/> Buscar por data
          </button>
        </nav>

        {tab === "calendario" && <AgendaOverview days={days} absenceByDate={absenceByDate} />}
        {tab === "busca" && <PatientSearch appts={agendaData.appts} />}
        {tab === "data" && <DateSearch appts={agendaData.appts} days={days} absenceByDate={absenceByDate} />}
      </main>

      <footer className="footnote">
        Limite de sinalização: {LIMIAR_SINALIZAR} pacientes/dia &nbsp;•&nbsp; Limite de superlotação: {LIMIAR_OVERFLOW} pacientes/dia
      </footer>
    </div>
  );
}

/* ================= AGENDA UPLOAD PANEL ================= */
function AgendaUploadPanel({ meta, onLoaded, onPublish, onDiscardLocal }) {
  const [open, setOpen] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Envie um arquivo .csv exportado do sistema de agendamento.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, meta: newMeta } = await parseAgendaCSVFile(file);
      onLoaded(data, newMeta);
    } catch (e) {
      setError(e.message || "Não foi possível processar o arquivo.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const importedDate = meta.importedAt ? new Date(meta.importedAt) : null;
  const importedLabel = importedDate
    ? `${importedDate.toLocaleDateString("pt-BR")} às ${importedDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    : null;

  const badgeLabel = meta.source === "local" ? "Atualização local — ainda não publicada"
    : meta.source === "published" ? "Publicada — visível para todos"
    : "Dados de exemplo";
  const badgeClass = meta.source === "local" ? "pill--warn"
    : meta.source === "published" ? "pill--ok"
    : "";

  return (
    <section className="panel upload-panel">
      <button className="panel-header" onClick={() => setOpen(o => !o)}>
        <div className="panel-header-left">
          <Icon.Upload size={17}/>
          <span>Atualizar agenda (CSV semanal)</span>
          <span className={"pill " + badgeClass}>{badgeLabel}</span>
        </div>
        <span className={"chevron" + (open ? " chevron--open" : "")}><Icon.ChevronDown size={17}/></span>
      </button>

      {open && (
        <div className="panel-body">
          <div className="upload-status">
            {meta.isDefault ? (
              <p className="upload-status-text">
                Exibindo os dados de exemplo carregados inicialmente. Envie o CSV mais recente do ambulatório para atualizar.
              </p>
            ) : (
              <p className="upload-status-text">
                <Icon.File size={14}/> <strong>{meta.fileName}</strong>{importedLabel ? <> — importado em {importedLabel}</> : null}
                {typeof meta.totalMarcados === "number" && <> &nbsp;•&nbsp; {meta.totalMarcados} consultas marcadas em {meta.totalDias} dias</>}
              </p>
            )}
          </div>

          <label
            className={"dropzone" + (dragOver ? " dropzone--active" : "")}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input ref={inputRef} type="file" accept=".csv" onChange={handleInputChange} hidden />
            <Icon.Upload size={22}/>
            <div className="dropzone-text">
              <strong>{loading ? "Processando arquivo..." : "1. Clique para escolher o CSV"}</strong>
              <span>ou arraste o arquivo aqui — mesmo formato exportado do sistema (separado por ;)</span>
            </div>
          </label>

          {error && <div className="form-error"><Icon.Alert size={14}/> {error}</div>}

          {meta.source === "local" && (
            <div className="publish-box">
              <p className="publish-box-text">
                <strong>2. Publique para todos verem.</strong> Baixe o arquivo de dados abaixo e suba-o
                no repositório do GitHub (substituindo o <code>{PUBLISHED_DATA_FILENAME}</code> existente,
                ou criando-o se for a primeira vez). Assim que o GitHub Pages atualizar, qualquer pessoa
                com o link passa a ver esta mesma agenda — sem nomes de pacientes.
              </p>
              <div className="publish-box-actions">
                <button className="btn btn--primary" onClick={onPublish}>
                  <Icon.Upload size={13}/> Baixar {PUBLISHED_DATA_FILENAME}
                </button>
                <button className="btn btn--text" onClick={onDiscardLocal}>
                  <Icon.RotateCcw size={13}/> Descartar esta atualização local
                </button>
              </div>
            </div>
          )}

          {meta.source === "published" && (
            <p className="empty-hint" style={{ marginTop: 10 }}>
              Estes são os dados publicados no repositório — todos que acessam este link veem a mesma agenda.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* ================= ABSENCE PANEL ================= */
function AbsencePanel({ absences, setAbsences }) {
  const [open, setOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [medico, setMedico] = useState("");
  const [tipo, setTipo] = useState(TIPO_AUSENCIA[0]);
  const [datasStr, setDatasStr] = useState("");
  const [formError, setFormError] = useState("");

  const resetForm = () => { setMedico(""); setTipo(TIPO_AUSENCIA[0]); setDatasStr(""); setFormError(""); };

  const handleAdd = () => {
    if (!medico.trim()) { setFormError("Informe o nome do médico."); return; }
    const rawDates = datasStr.split(",").map(s => s.trim()).filter(Boolean);
    if (!rawDates.length) { setFormError("Informe ao menos uma data (ex: 05/10/26)."); return; }
    const isoDates = [];
    for (const r of rawDates) {
      const iso = ddmmyyyyToISO(r);
      if (!iso) { setFormError(`Data inválida: "${r}". Use o formato dd/mm/aa.`); return; }
      isoDates.push(iso);
    }
    const entry = { id: "a" + Date.now(), medico: medico.trim(), tipo, datas: isoDates };
    setAbsences(prev => [...prev, entry]);
    resetForm();
    setShowForm(false);
  };

  const handleRemove = (id) => setAbsences(prev => prev.filter(a => a.id !== id));

  return (
    <section className="panel absence-panel">
      <button className="panel-header" onClick={() => setOpen(o => !o)}>
        <div className="panel-header-left">
          <Icon.Stethoscope size={17}/>
          <span>Ausências &amp; coberturas médicas</span>
          <span className="pill">{absences.length}</span>
        </div>
        <span className={"chevron" + (open ? " chevron--open" : "")}><Icon.ChevronDown size={17}/></span>
      </button>

      {open && (
        <div className="panel-body">
          {absences.length === 0 && <p className="empty-hint">Nenhuma ausência registrada.</p>}

          <div className="absence-list">
            {absences.map(a => (
              <div className="absence-card" key={a.id}>
                <div className="absence-card-main">
                  <div className="absence-medico">{a.medico}</div>
                  <div className={"absence-tipo tipo--" + tipoClass(a.tipo)}>{a.tipo}</div>
                  <div className="absence-datas">
                    {a.datas.slice().sort().map(d => (
                      <span className="date-chip" key={d}>{formatDateShort(d)}</span>
                    ))}
                  </div>
                </div>
                <button className="icon-btn icon-btn--danger" onClick={() => handleRemove(a.id)} title="Remover ausência">
                  <Icon.Trash size={15}/>
                </button>
              </div>
            ))}
          </div>

          {!showForm ? (
            <button className="btn btn--ghost" onClick={() => setShowForm(true)}>
              <Icon.Plus size={15}/> Registrar ausência
            </button>
          ) : (
            <div className="absence-form">
              <div className="form-row">
                <label>
                  Médico(a)
                  <input value={medico} onChange={e => setMedico(e.target.value)} placeholder="Ex: Maria Tavares" />
                </label>
                <label>
                  Motivo
                  <select value={tipo} onChange={e => setTipo(e.target.value)}>
                    {TIPO_AUSENCIA.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>
              </div>
              <label className="form-row-full">
                Data(s) — separe por vírgula, formato dd/mm/aa
                <input value={datasStr} onChange={e => setDatasStr(e.target.value)} placeholder="Ex: 05/10/26, 19/10/26" />
              </label>
              {formError && <div className="form-error"><Icon.Alert size={14}/> {formError}</div>}
              <div className="form-actions">
                <button className="btn btn--primary" onClick={handleAdd}>Salvar</button>
                <button className="btn btn--text" onClick={() => { resetForm(); setShowForm(false); }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function tipoClass(tipo) {
  if (tipo.startsWith("Férias")) return "ferias";
  if (tipo.startsWith("Abono")) return "abono";
  if (tipo.startsWith("Cobertura")) return "cobertura";
  return "licenca";
}

/* ================= AGENDA OVERVIEW ================= */
function AgendaOverview({ days, absenceByDate }) {
  const grouped = useMemo(() => {
    const map = new Map();
    days.forEach(d => {
      const dt = parseISO(d.data);
      const key = `${dt.getFullYear()}-${dt.getMonth()}`;
      if (!map.has(key)) map.set(key, { label: `${MONTHS_PT[dt.getMonth()]} de ${dt.getFullYear()}`, items: [] });
      map.get(key).items.push(d);
    });
    return Array.from(map.values());
  }, [days]);

  if (!days.length) {
    return <div className="empty-state">Nenhum dado de agenda carregado.</div>;
  }

  return (
    <section className="overview">
      {grouped.map(month => (
        <div className="month-group" key={month.label}>
          <h3 className="month-title">{month.label}</h3>
          <div className="day-list">
            {month.items.map(d => {
              const status = statusFor(d.marcados);
              const meta = STATUS_META[status];
              const abs = absenceByDate[d.data];
              const pct = Math.min(100, Math.round((d.marcados / LIMIAR_OVERFLOW) * 100));
              return (
                <div className={"day-card day-card--" + status} key={d.data}>
                  <div className="day-card-date">
                    <div className="day-num">{parseISO(d.data).getDate().toString().padStart(2,"0")}</div>
                    <div className="day-wd">{weekdayOf(d.data).replace("-feira","")}</div>
                  </div>

                  <div className="day-card-body">
                    <div className="day-card-toprow">
                      <span className="day-count" style={{ color: meta.color }}>
                        {d.marcados} <span className="day-count-sub">/ {LIMIAR_OVERFLOW}</span>
                      </span>
                      {status !== "normal" && (
                        <span className="badge" style={{ color: meta.color, background: meta.bg }}>
                          <Icon.Alert size={12}/> {meta.label}
                        </span>
                      )}
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: pct + "%", background: meta.color }} />
                      <div className="bar-threshold" style={{ left: (LIMIAR_SINALIZAR/LIMIAR_OVERFLOW*100) + "%" }} />
                    </div>
                    <div className="day-meta">
                      {d.livres > 0 && <span className="meta-chip">{d.livres} vaga{d.livres>1?"s":""} livre{d.livres>1?"s":""}</span>}
                      {d.reservado > 0 && <span className="meta-chip">{d.reservado} reservada{d.reservado>1?"s":""}</span>}
                      {d.feriado > 0 && <span className="meta-chip">{d.feriado} bloqueio(feriado)</span>}
                      {d.bloqueio_outros > 0 && <span className="meta-chip">{d.bloqueio_outros} bloqueio(outros)</span>}
                    </div>

                    {abs && abs.length > 0 && (
                      <div className="absence-flags">
                        {abs.map((a,i) => (
                          <div className={"absence-flag flag--" + tipoClass(a.tipo)} key={i}>
                            <Icon.Stethoscope size={12}/> {a.medico} — {a.tipo}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ================= PATIENT SEARCH ================= */
function PatientSearch({ appts }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return appts.filter(a => a.prontuario.includes(q))
      .sort((a,b) => (a.data + a.hora).localeCompare(b.data + b.hora));
  }, [query, appts]);

  const grouped = useMemo(() => {
    if (!results) return [];
    const map = new Map();
    results.forEach(r => {
      if (!map.has(r.prontuario)) map.set(r.prontuario, { prontuario: r.prontuario, items: [] });
      map.get(r.prontuario).items.push(r);
    });
    return Array.from(map.values());
  }, [results]);

  return (
    <section className="search-section">
      <div className="search-box">
        <Icon.Search size={18}/>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="Digite o número do prontuário..."
          inputMode="numeric"
        />
        {query && (
          <button className="icon-btn" onClick={() => setQuery("")} title="Limpar">
            <Icon.X size={15}/>
          </button>
        )}
      </div>

      {!query && (
        <div className="empty-state">
          <Icon.User size={28}/>
          <p>Digite um número de prontuário para ver as consultas agendadas.</p>
        </div>
      )}

      {query && grouped.length === 0 && (
        <div className="empty-state">
          <Icon.Alert size={28}/>
          <p>Nenhuma consulta marcada encontrada para o prontuário "{query}".</p>
        </div>
      )}

      {grouped.map(g => (
        <div className="patient-card" key={g.prontuario}>
          <div className="patient-card-header">
            <div>
              <div className="patient-name mono">Prontuário nº {g.prontuario}</div>
            </div>
            <span className="pill pill--count">{g.items.length} consulta{g.items.length>1?"s":""}</span>
          </div>
          <table className="appt-table">
            <thead>
              <tr><th>Data</th><th>Dia da semana</th><th>Horário</th><th>Médico(a)</th></tr>
            </thead>
            <tbody>
              {g.items.map((it,i) => (
                <tr key={i}>
                  <td>{formatDateShort(it.data)}</td>
                  <td className="capitalize">{weekdayOf(it.data)}</td>
                  <td>{it.hora}</td>
                  <td>{toTitleCase(it.medico)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}

/* ================= DATE SEARCH ================= */
function DateSearch({ appts, days, absenceByDate }) {
  const [selectedDate, setSelectedDate] = useState("");

  const minDate = days.length ? days[0].data : undefined;
  const maxDate = days.length ? days[days.length - 1].data : undefined;

  const dayInfo = useMemo(() => {
    if (!selectedDate) return null;
    return days.find(d => d.data === selectedDate) || null;
  }, [selectedDate, days]);

  const results = useMemo(() => {
    if (!selectedDate) return null;
    return appts.filter(a => a.data === selectedDate).sort((a, b) => a.hora.localeCompare(b.hora));
  }, [selectedDate, appts]);

  const status = dayInfo ? statusFor(dayInfo.marcados) : null;
  const meta = status ? STATUS_META[status] : null;
  const abs = selectedDate ? absenceByDate[selectedDate] : null;

  return (
    <section className="search-section">
      <div className="search-box search-box--date">
        <Icon.Calendar size={18}/>
        <input
          type="date"
          value={selectedDate}
          min={minDate}
          max={maxDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
        {selectedDate && (
          <button className="icon-btn" onClick={() => setSelectedDate("")} title="Limpar">
            <Icon.X size={15}/>
          </button>
        )}
      </div>

      {!selectedDate && (
        <div className="empty-state">
          <Icon.Calendar size={28}/>
          <p>Escolha uma data para ver todas as consultas marcadas naquele dia.</p>
        </div>
      )}

      {selectedDate && (
        <div className="patient-card">
          <div className="patient-card-header">
            <div>
              <div className="patient-name capitalize">{weekdayOf(selectedDate)}</div>
              <div className="patient-pront">{formatDateLong(selectedDate)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {dayInfo && (
                <span className="day-count" style={{ color: meta.color }}>
                  {dayInfo.marcados} <span className="day-count-sub">/ {LIMIAR_OVERFLOW}</span>
                </span>
              )}
              <span className="pill pill--count">
                {results.length} consulta{results.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {dayInfo && status !== "normal" && (
            <div className="badge" style={{ color: meta.color, background: meta.bg, marginBottom: 12, width: "fit-content" }}>
              <Icon.Alert size={12}/> {meta.label}
            </div>
          )}

          {abs && abs.length > 0 && (
            <div className="absence-flags" style={{ marginBottom: 12 }}>
              {abs.map((a, i) => (
                <div className={"absence-flag flag--" + tipoClass(a.tipo)} key={i}>
                  <Icon.Stethoscope size={12}/> {a.medico} — {a.tipo}
                </div>
              ))}
            </div>
          )}

          {results.length === 0 ? (
            <p className="empty-hint">Nenhuma consulta marcada para esta data.</p>
          ) : (
            <table className="appt-table">
              <thead>
                <tr><th>Horário</th><th>Prontuário</th><th>Médico(a)</th></tr>
              </thead>
              <tbody>
                {results.map((it, i) => (
                  <tr key={i}>
                    <td>{it.hora}</td>
                    <td className="mono">{it.prontuario}</td>
                    <td>{toTitleCase(it.medico)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}

/* ================= STYLES ================= */
const CSS = `
:root {
  --bg: #F4F7F6;
  --surface: #FFFFFF;
  --ink: #14302C;
  --ink-soft: #4B655F;
  --muted: #7B928C;
  --border: #DCE7E3;
  --primary: #0E6E66;
  --primary-dark: #0A4F49;
  --primary-tint: #E4F2EF;
  --ok: #2E7D5B;
  --ok-bg: #E7F4EC;
  --warn: #B5790A;
  --warn-bg: #FDF1DC;
  --danger: #B23A2E;
  --danger-bg: #FBE7E4;
}
* { box-sizing: border-box; }
.app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100%;
  width: 100%;
}
.capitalize { text-transform: capitalize; }
.mono { font-family: 'IBM Plex Mono', monospace; }

/* Topbar */
.topbar { background: linear-gradient(135deg, var(--primary-dark), var(--primary)); color: #fff; }
.topbar-inner { max-width: 980px; margin: 0 auto; padding: 22px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.brand { display: flex; align-items: center; gap: 12px; }
.brand-mark { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.16); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.brand-title { font-family: 'Space Grotesk', 'Inter', sans-serif; font-weight: 600; font-size: 18px; letter-spacing: -0.01em; }
.brand-sub { font-size: 12.5px; opacity: 0.82; margin-top: 2px; }
.topbar-stats { display: flex; gap: 22px; }
.stat { display: flex; flex-direction: column; align-items: flex-end; }
.stat-value { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 22px; font-weight: 700; line-height: 1; }
.stat-label { font-size: 11px; opacity: 0.82; margin-top: 4px; white-space: nowrap; }
.stat--warn .stat-value { color: #FFD98A; }
.stat--danger .stat-value { color: #FFB4A8; }

/* Content */
.content { max-width: 980px; margin: 0 auto; padding: 22px 20px 40px; }
.footnote { max-width: 980px; margin: 0 auto; padding: 4px 20px 40px; font-size: 12px; color: var(--muted); }

/* Panel */
.panel { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; margin-bottom: 20px; overflow: hidden; }
.panel-header { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 15px 18px; background: transparent; border: none; cursor: pointer; font: inherit; color: var(--ink); }
.panel-header-left { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14.5px; color: var(--primary-dark); }
.pill { background: var(--primary-tint); color: var(--primary-dark); font-size: 11.5px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.chevron { color: var(--muted); transition: transform 0.2s ease; display: flex; }
.chevron--open { transform: rotate(180deg); }
.panel-body { padding: 0 18px 18px; border-top: 1px solid var(--border); padding-top: 14px; }
.empty-hint { color: var(--muted); font-size: 13.5px; margin: 6px 0 12px; }

.pill--ok { background: var(--ok-bg); color: var(--ok); }
.pill--warn { background: var(--warn-bg); color: var(--warn); }
.publish-box { margin-top: 14px; background: var(--primary-tint); border: 1px solid #C7E4DD; border-radius: 10px; padding: 14px 16px; }
.publish-box-text { font-size: 13px; color: var(--primary-dark); margin: 0 0 12px; line-height: 1.5; }
.publish-box-text code { background: rgba(255,255,255,0.6); padding: 1px 6px; border-radius: 5px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }
.publish-box-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.upload-status { margin-bottom: 12px; }
.upload-status-text { font-size: 13px; color: var(--ink-soft); display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: 0; }
.dropzone { display: flex; align-items: center; gap: 14px; border: 1.5px dashed var(--border); border-radius: 12px; padding: 16px 18px; cursor: pointer; color: var(--muted); background: #FAFCFB; transition: border-color 0.15s ease, background 0.15s ease; }
.dropzone:hover { border-color: var(--primary); background: var(--primary-tint); }
.dropzone--active { border-color: var(--primary); background: var(--primary-tint); color: var(--primary-dark); }
.dropzone-text { display: flex; flex-direction: column; gap: 2px; font-size: 13px; }
.dropzone-text strong { color: var(--ink); font-size: 14px; }
.absence-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.absence-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; background: #FAFCFB; border: 1px solid var(--border); border-radius: 10px; padding: 10px 12px; }
.absence-card-main { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.absence-medico { font-weight: 600; font-size: 13.5px; min-width: 110px; }
.absence-tipo { font-size: 11.5px; font-weight: 700; padding: 2px 9px; border-radius: 20px; white-space: nowrap; }
.tipo--ferias { background: #E4F2EF; color: var(--primary-dark); }
.tipo--abono { background: var(--warn-bg); color: var(--warn); }
.tipo--cobertura { background: #E7ECFB; color: #3D4FA0; }
.tipo--licenca { background: var(--danger-bg); color: var(--danger); }
.absence-datas { display: flex; gap: 6px; flex-wrap: wrap; }
.date-chip { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; background: #EEF3F1; color: var(--ink-soft); padding: 2px 7px; border-radius: 6px; }

.icon-btn { border: none; background: transparent; color: var(--muted); cursor: pointer; padding: 6px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: #EEF3F1; color: var(--ink); }
.icon-btn--danger:hover { background: var(--danger-bg); color: var(--danger); }

.btn { border: none; cursor: pointer; font: inherit; font-weight: 600; border-radius: 9px; padding: 9px 14px; display: inline-flex; align-items: center; gap: 6px; font-size: 13.5px; }
.btn--ghost { background: var(--primary-tint); color: var(--primary-dark); }
.btn--ghost:hover { background: #D6ECE6; }
.btn--primary { background: var(--primary); color: #fff; }
.btn--primary:hover { background: var(--primary-dark); }
.btn--text { background: transparent; color: var(--muted); }
.btn--text:hover { color: var(--ink); }

.absence-form { background: #FAFCFB; border: 1px dashed var(--border); border-radius: 10px; padding: 14px; margin-top: 4px; }
.form-row { display: flex; gap: 12px; margin-bottom: 10px; flex-wrap: wrap; }
.form-row label, .form-row-full { display: flex; flex-direction: column; font-size: 12px; color: var(--ink-soft); font-weight: 600; gap: 5px; flex: 1; min-width: 180px; }
.form-row-full { margin-bottom: 10px; }
.absence-form input, .absence-form select {
  font: inherit; font-size: 13.5px; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border); background: #fff; color: var(--ink);
}
.absence-form input:focus, .absence-form select:focus { outline: 2px solid var(--primary); outline-offset: 1px; }
.form-error { display: flex; align-items: center; gap: 6px; color: var(--danger); font-size: 12.5px; margin-bottom: 10px; }
.form-actions { display: flex; gap: 8px; }

/* Tabs */
.tabs { display: flex; gap: 6px; margin-bottom: 18px; border-bottom: 1px solid var(--border); }
.tab { display: flex; align-items: center; gap: 7px; background: transparent; border: none; font: inherit; font-weight: 600; font-size: 13.5px; color: var(--muted); padding: 10px 14px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.tab:hover { color: var(--ink); }
.tab--active { color: var(--primary-dark); border-bottom-color: var(--primary); }

/* Overview */
.month-group { margin-bottom: 26px; }
.month-title { font-family: 'Space Grotesk', 'Inter', sans-serif; text-transform: capitalize; font-size: 15px; font-weight: 700; color: var(--primary-dark); margin: 0 0 10px 2px; }
.day-list { display: flex; flex-direction: column; gap: 10px; }
.day-card { display: flex; gap: 14px; background: var(--surface); border: 1px solid var(--border); border-left: 4px solid var(--border); border-radius: 12px; padding: 12px 14px; }
.day-card--sinalizar { border-left-color: var(--warn); }
.day-card--overflow { border-left-color: var(--danger); background: #FFFBFA; }
.day-card-date { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 52px; flex-shrink: 0; border-right: 1px solid var(--border); padding-right: 12px; }
.day-num { font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 21px; font-weight: 700; line-height: 1; }
.day-wd { font-size: 10.5px; text-transform: capitalize; color: var(--muted); margin-top: 3px; }
.day-card-body { flex: 1; min-width: 0; }
.day-card-toprow { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; flex-wrap: wrap; }
.day-count { font-family: 'IBM Plex Mono', monospace; font-weight: 700; font-size: 17px; }
.day-count-sub { font-size: 12px; font-weight: 500; color: var(--muted); }
.badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }
.bar-track { position: relative; height: 6px; background: #EEF3F1; border-radius: 4px; overflow: visible; margin-bottom: 8px; }
.bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
.bar-threshold { position: absolute; top: -2px; width: 2px; height: 10px; background: var(--ink); opacity: 0.25; }
.day-meta { display: flex; gap: 6px; flex-wrap: wrap; }
.meta-chip { font-size: 11px; color: var(--ink-soft); background: #F1F5F3; padding: 2px 8px; border-radius: 20px; }
.absence-flags { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.absence-flag { display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; padding: 4px 9px; border-radius: 8px; width: fit-content; }
.flag--ferias { background: #E4F2EF; color: var(--primary-dark); }
.flag--abono { background: var(--warn-bg); color: var(--warn); }
.flag--cobertura { background: #E7ECFB; color: #3D4FA0; }
.flag--licenca { background: var(--danger-bg); color: var(--danger); }

/* Search */
.search-section { display: flex; flex-direction: column; gap: 16px; }
.search-box { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; color: var(--muted); }
.search-box input { flex: 1; border: none; outline: none; font: inherit; font-size: 15px; color: var(--ink); background: transparent; }
.search-box--date input[type="date"] { color-scheme: light; cursor: pointer; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; color: var(--muted); padding: 50px 20px; font-size: 14px; }
.patient-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; }
.patient-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.patient-name { font-weight: 700; font-size: 15px; }
.patient-pront { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--muted); margin-top: 2px; }
.pill--count { background: var(--primary-tint); color: var(--primary-dark); }
.appt-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.appt-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; color: var(--muted); padding: 6px 8px; border-bottom: 1px solid var(--border); }
.appt-table td { padding: 8px; border-bottom: 1px solid #F0F4F2; }
.appt-table tr:last-child td { border-bottom: none; }

@media (max-width: 640px) {
  .topbar-stats { gap: 14px; width: 100%; justify-content: space-between; }
  .stat { align-items: flex-start; }
  .day-card { flex-direction: column; }
  .day-card-date { flex-direction: row; width: 100%; border-right: none; border-bottom: 1px solid var(--border); padding-right: 0; padding-bottom: 8px; gap: 8px; justify-content: flex-start; }
}
`;
