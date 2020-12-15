import type { Context } from '@nuxt/types'
import type { GetterTree, ActionTree, MutationTree } from 'vuex'
export const namespace = 'welp'

export interface IMasterState {
    max_experience_value: number,
    experience_per_minute_log: Array<number>
}

export const state = (): IMasterState => ({
    max_experience_value: 0,
    experience_per_minute_log: []
})

export const GetterType = {
    CURRENT_EXP_LOG: 'currentExpLog'
}

export const getters: GetterTree<IMasterState, IMasterState> = {
    [GetterType.CURRENT_EXP_LOG]: state => state.experience_per_minute_log.map(each_exp => { return { experience: each_exp } })
}

export const MutationType = {
    CHANGE_MAX_EXPERIENCE: 'changeMaxExperience',
    ADDING_EXP_TO_EXPM_LOG: 'addDataToExpmLog'
}

export const mutations: MutationTree<IMasterState> = {
    [MutationType.CHANGE_MAX_EXPERIENCE]: (state, newExp: number) => { state.max_experience_value = newExp },
    [MutationType.ADDING_EXP_TO_EXPM_LOG]: (state, expToAdd: number) => { state.experience_per_minute_log.push(expToAdd) }
}

export const actionType = {
    SET_MAX_EXPERIENCE_VALUE: 'setMaxExperienceValue',
    ADD_EXP_TO_EXPM_LOG: 'addExpToExpmLog'
}

export const actions: ActionTree<IMasterState, IMasterState> = {
    [actionType.SET_MAX_EXPERIENCE_VALUE] ({ commit }, newExp: number) {
        commit(MutationType.CHANGE_MAX_EXPERIENCE, newExp)
    },
    [actionType.ADD_EXP_TO_EXPM_LOG] ({ commit }, expToAdd: number) {
        commit(MutationType.ADDING_EXP_TO_EXPM_LOG, expToAdd)
    }
}