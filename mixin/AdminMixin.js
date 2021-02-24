export default {
    // created: function () {
    //     if(!this.$store.hasModule(this.moduleName)){
    //             this.$store.registerModule(this.moduleName, this.adminModule);
    //     }
    //     let ListAdminModule = this.getListAdminModule;
    //     ListAdminModule.forEach((item) => {
    //             if(item !== this.moduleName && this.$store.hasModule(item) ){
    //                     this.$store.unregisterModule(item);
    //                     return;
    //                 }
    //     });
    // },
    // created() {
    //
    //     this.$store.registerModule('adminModuleStore', this.adminModuleStore )
    // },
    //
    // beforeDestroy() {
    //     this.$store.unregisterModule('adminModuleStore')
    // },

    methods: {
        formatDate: function(date, option = {}) {
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
        }, async showMsgBoxVerify(objDataAlert) {
            this.notifyBox = '';
             const messageNodes = this.$createElement(
                    'div',
                    {
                        domProps: { innerHTML: objDataAlert.content }
                    }
            )
            return await this.$bvModal.msgBoxConfirm([messageNodes], {
                    title: objDataAlert.title,
                    size: 'md',
                    buttonSize: 'sm',
                    okVariant: 'success',
                    okTitle: 'OK',
                    cancelTitle: 'Cancel',
                    footerClass: 'p-2',
                    hideHeaderClose: false,
                    centered: true
                })
                .then(value => {
                    return value;
                })
                .catch(err => {
                    return false;
                    // An error occurred
                })
        },
        async  showMsgBoxOK(objDataAlert) {
            this.boxTwo = ''
            const messageNodes = this.$createElement(
                    'div',
                    {
                        domProps: { innerHTML: objDataAlert.content }
                    }
            )
            return await this.$bvModal.msgBoxOk([messageNodes], {
                    title: objDataAlert.title,
                    size: 'md',
                    buttonSize: 'sm',
                    okTitle: 'OK',
                    okVariant: 'success',
                    headerClass: 'p-2 border-bottom-0',
                    footerClass: 'p-2 border-top-0',
                    centered: true
                })
                .then(value => {
                    return value;
                })
                .catch(err => {
                    return false;
                    // An error occurred
                })
        },
    }
   
}