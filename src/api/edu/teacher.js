import request from '@/utils/request'

export default {
    getTeacherListByPage(page, row, queryTeacher) {
        return request({
            url: `/edu-service/edu-teacher/${page}/${row}`,
            method: 'post',
            //data 把对象转换成json进行传递到接口
            data: queryTeacher
        })
    },
    deleteTeacherById(id) {
        return request({
            url: `/edu-service/edu-teacher/${id}`,
            method: 'delete'
        })
    },
    addTeacher(eduTeacher) {
        return request({
            url: `/edu-service/edu-teacher`,
            method: 'post',
            data: eduTeacher
        })

    },
    getTeacherById(id) {
        return request({
            url: `/edu-service/edu-teacher/${id}`,
            method: 'get'
        })
    },
    updateTeacher(eduTeacher) {
        return request({
            url: '/edu-service/edu-teacher',
            method: 'put',
            data: eduTeacher
        })
    },
    listAllTeacher() {
        return request({
            url: '/edu-service/edu-teacher',
            method: 'get'
        })
    }
}