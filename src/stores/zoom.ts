import { _getState, _getOffices } from '@/api/repositories/zoom.repository'
import { defineStore } from 'pinia'

export default defineStore({
    id: 'zoom',
    state: () => ({
        _status: null,
        _error: null,
        _states: null,
        _offices: null,
    }),
    getters: {
        isLoading: (state) => state._status === 'loading',
        isReady: (state) => state._status === 'ready',
        isError: (state) => state._status === 'error',
        error: (state) => state._error,
        states: (state) => state._states,
        offices: (state) => state._offices,
    },
    actions: {
        async getState() {
            this.changeStatus('loading')
            try {
                const response = await _getState()
                if (response) {
                    this._states = response.data
                    this.changeStatus('ready')
                }
            } catch (error) {
                this.changeStatus('error', error)
            }
        },
        async getOffices(_value) {
            this.changeStatus('loading')
            try {
                const response = await _getOffices(_value)
                if (response) {
                    this._offices = response.data
                    this.changeStatus('ready')
                }
            } catch (error) {
                this.changeStatus('error', error)
            }
        },
        reset() {


        },
        changeStatus(status, error = null) {
            this._status = status
            if (status === 'error') this._error = error
        },
    },
})
