import request from '@/utils/request'

export default {
    listSubjectCategory() {
        return request({
            url: '/edu-service/edu-subject',
            method: 'get'
        })
    }
}
