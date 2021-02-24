import { URL_API_LOGIN_ADMIN, URL_API_ADMIN } from "~/common/config";
const cookieparser = process.server ? require('cookieparser') : undefined
export const state = () => ({
    auth: null,
    page_data: {}
})
export const getters = {
    getPageData(rootState) {
        return rootState.page_data;
    },
    getTokens(rootState) {
        return rootState.auth;
    }
}
export const mutations = {
    SET_PAGEDATA: (state, page_data) => {
        state.page_data = page_data;
    },

    SET_AUTH(state, auth) {
        state.auth = auth
    }
}

export const actions = {
    nuxtServerInit({ commit }, { req }) {
        let auth = null
        if (req.headers.cookie) {
            const parsed = cookieparser.parse(req.headers.cookie)
            try {
                auth = JSON.parse(parsed.auth)
            } catch (err) {
                // No valid cookie found
            }
        }
        commit('SET_AUTH', auth)
    },
    setPageData({ commit }, params = null) {
        commit('SET_PAGEDATA', params)
    },
    logout({ commit }) {
      
        this.$cookies.remove('auth');
        commit('SET_AUTH', null);
    },
    async loginAdminAct({ commit }, params = null) {
        try {
            const result = await this.$axios.$post('login', params);
            if (result.status == 200) {
                return {
                    ok: true,
                    data: result,
                    error: null
                }
            } else {
                return {
                    ok: false,
                    error: result.data.message
                }
            }
        } catch (error) {
            return {
                ok: false,
                error: error.message
            }
        }
    },

    async handleCrudAPIAdmin({ commit , dispatch , app }, objPagram) {
        let method =  objPagram.method;
        let urlAPi =  objPagram.urlAPi;
        let objCondition = objPagram.objCondition;
        const accessToken = this.getters.getTokens.accessToken;
        if(accessToken){
            try {
                this.$axios.setToken(accessToken, 'Bearer');
                const result = await this.$axios[method](urlAPi, objCondition);
                if (result.status == 200) {
                    if(result.data.logout)
                        dispatch('logout');
                    return {
                        ok: true,
                        data: result.data,
                        error: result.data.error
                    }
                } else {
                    return {
                        ok: false,
                        error: result.error
                    }
                }
            } catch (error) {
                let code =  error.response.status;
                if(code == 401) 
                {
                    dispatch('logout');
                }
                return {
                    code: code,
                    ok: false,
                    error: error.response.data.errors
                }
            }
        }else{
            return {
                ok: false,
                error: "Token is not exits"
            }
        }
    },
    
    async handleLogout({ dispatch }) {
        dispatch('logout');
    },
}