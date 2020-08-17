const Intl = require('intl')
const Member = require('../models/Member')
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
            callback(members){

                const pagination = {
                    total: Math.ceil(members[0].total / limit),
                    page
                }
                return res.render("members/index", {members, pagination, filter})
            }
        }

        Member.paginate(params)

    },  

    create(req, res){

        Member.instructorsSelectOptions(function(options){
            return res.render("members/create", { instructorOptions: options});
        })
        
    },

    post(req, res){           
        
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send ('Please, fill all forms')
            }
        }

        Member.create(req.body, function(member){
            return res.redirect(`/members/${member.id}`)
        })

        

    },
    show(req, res){
        const {id} = req.params

        Member.find(id, function(member){
            if (!member) return res.send("member not found")
            
            member.birth = simpleDate(member.birth).birthDay

            return res.render('members/show', {member})
        })
 
    },
    edit(req, res){
        const {id} = req.params

        Member.find(id, function(member){
            if (!member) return res.send("member not found")
            
            member.age = simpleDate(member.birth).iso

            Member.instructorsSelectOptions(function(options){
                return res.render("members/edit", {instructorOptions: options, member});
            })
                

        })
    },
    put(req, res){
        const keys = Object.keys(req.body)

        for(key of keys) {
            if(req.body[key] == "") {
                return res.send ('Please, fill all forms')
            }
        }
        
        Member.update(req.body, function(){
            return res.redirect(`/members/${req.body.id}`)
        })
    },
    delete(req, res){
        const { id } = req.body

        Member.delete(id, function(){
            
            return res.redirect(`/members`)
        })
    },
}

