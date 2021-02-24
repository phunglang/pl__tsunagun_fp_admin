import Vue from 'vue';

export const adminMixin = Vue.extend({
   methods: {
        formatDate(date : string, option : any) : string {
            let timeStr = "";
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            if (option.action === "fultime") {
                var hours = '' + d.getHours();
                var minute = '' + d.getMinutes();
                var second = '' + d.getSeconds();
                if (hours.length < 2) hours = '0' + hours;
                if (minute.length < 2) minute = '0' + minute;
                if (second.length < 2) second = '0' + second;
                return [year, month, day].join('-') + " " + [hours, minute,second].join(':');
            }

            return [year, month, day].join('-');
        }, 
        test() : string {
           return "Vu trong luat";
        }, 
        
    }
});