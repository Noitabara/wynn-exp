import type { Context } from '@nuxt/types'
import type { GetterTree, ActionTree, MutationTree } from 'vuex'
export const namespace = 'welp'

export interface IMasterState {
    max_experience_value: number
}

export const state = (): IMasterState => ({
    max_experience_value: 0
})

export const getters: GetterTree<IMasterState, IMasterState> = {}

export const MutationType = {
    CHANGE_MAX_EXPERIENCE: 'changeMaxExperience'
}

export const mutations: MutationTree<IMasterState> = {
    [MutationType.CHANGE_MAX_EXPERIENCE]: (state, newExp: number) => { state.max_experience_value = newExp }
}

export const actionType = {
    SET_MAX_EXPERIENCE_VALUE: 'setMaxExperienceValue'
}

export const actions: ActionTree<IMasterState, IMasterState> = {
    [actionType.SET_MAX_EXPERIENCE_VALUE] ({ commit }, newExp: number) {
        commit(MutationType.CHANGE_MAX_EXPERIENCE, newExp)
    }
}