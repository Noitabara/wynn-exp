import type { Context } from '@nuxt/types'
import type { GetterTree, ActionTree, MutationTree } from 'vuex'
export const namespace = 'welp'

export interface IMasterState {
    current_experience_value: number,
    max_experience_value: number
}

export const state = (): IMasterState => ({
    current_experience_value: 0,
    max_experience_value: 0
})

export const getters: GetterTree<IMasterState, IMasterState> = {}

export const MutationType = {
    CHANGE_EXPERIENCE_VALUE: 'changeExperienceValue',
    CHANGE_MAX_EXPERIENCE: 'changeMaxExperience'
}

export const mutations: MutationTree<IMasterState> = {
    [MutationType.CHANGE_EXPERIENCE_VALUE]: (state, newExp: number) => { state.current_experience_value = newExp },
    [MutationType.CHANGE_MAX_EXPERIENCE]: (state, newExp: number) => { state.max_experience_value = newExp }
}

export const actionType = {
    SET_EXPERIENCE_VALUE: 'setExperienceValue',
    SET_MAX_EXPERIENCE_VALUE: 'setMaxExperienceValue'
}

export const actions: ActionTree<IMasterState, IMasterState> = {
    [actionType.SET_EXPERIENCE_VALUE] ({ commit }, newExp: number) {
        commit(MutationType.CHANGE_EXPERIENCE_VALUE, newExp)
    },
    [actionType.SET_MAX_EXPERIENCE_VALUE] ({ commit }, newExp: number) {
        commit(MutationType.CHANGE_MAX_EXPERIENCE, newExp)
    }
}