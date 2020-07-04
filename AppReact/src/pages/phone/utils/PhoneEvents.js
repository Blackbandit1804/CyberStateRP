export const initEvents = () => {
    alt.on('telePhone.enable', state => {
        window.telePhone.enable(state)
    })

    alt.on('telePhone.sendMessage', data => {
        window.telePhone.sendMessage(data)
    })

    alt.on('telePhone::new::contact', data => {
        window.telePhone.createContact(data)
    })

    alt.on('telePhone::delete::contact', id => {
        window.telePhone.deleteContact(id)
    })

    alt.on('telePhone::change::contact', data => {
        window.telePhone.changeContact(data)
    })

    alt.on('telePhone.setnum', num => {
        window.telePhone.setNumber(num)
    })

    alt.on(`start.telephone.call`, num => {
        window.telePhone.call(num)
    })

    alt.on(`create.telephone.call`, num => {
        window.telePhone.receiveCall(num)
    })
    
    alt.on(`player.telephone.accept`, () => {
        window.telePhone.startedTalking()
    })

    alt.on(`target.telephone.accept`, () => {
        window.telePhone.acceptCall()
    })

    alt.on(`call.decline`, () => {
        window.telePhone.finishCall()
    });
}
