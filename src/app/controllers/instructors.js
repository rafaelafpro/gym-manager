const Intl = require('intl')
const Instructor = require('../models/Instructor')
const { age, simpleDate } = require('../../lib/utils')



module.exports = {
    index(req, res){
        let { filter,page,limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * ( page-1 )

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(instructors){
                for (let i=0; i<instructors.length; i++){
                    instructors[i].services = instructors[i].services.split(',')
                }

                const pagination = {
                    total: Math.ceil(instructors[0].total / limit),
                    page
                }
                return res.render("instructors/index", {instructors, pagination, filter})
            }
        }

        Instructor.paginate(params)

    },  

    create(req, res){
        return res.render("instructors/create");
    },

    post(req, res){           
        
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send ('Please, fill all forms')
            }
        }

        Instructor.create(req.body, function(instructor){
            return res.redirect(`/instructors/${instructor.id}`)
        })

        

    },
    show(req, res){
        const {id} = req.params

        Instructor.find(id, function(instructor){
            if (!instructor) return res.send("Instructor not found")
            
            instructor.age = age(instructor.birth)
            instructor.services = instructor.services.split(",")
            instructor.created_at = simpleDate(instructor.created_at).format

            return res.render('instructors/show', {instructor})
        })
 
    },
    edit(req, res){
        const {id} = req.params

        Instructor.find(id, function(instructor){
            if (!instructor) return res.send("Instructor not found")
            
            instructor.age = simpleDate(instructor.birth).iso
            instructor.services = instructor.services.split(",")
            instructor.created_at = simpleDate(instructor.created_at).format

            return res.render('instructors/edit', {instructor})
        })
    },
    put(req, res){
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send ('Please, fill all forms')
            }
        }
        
        Instructor.update(req.body, function(){
            return res.redirect(`/instructors/${req.body.id}`)
        })
    },
    delete(req, res){
        const { id } = req.body

        Instructor.delete(id, function(){
            
            return res.redirect(`/instructors`)
        })
    },
}

