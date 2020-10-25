// describe('my test 1',()=>{
//     it('returns true',()=>{
//         expect(true).toEqual(true)
//     })
// })
//---------------------------//
// feature
class FriendsList{
    friends:string[] = []
    addFriend(name:string){
        this.friends.push(name)
        this.announceFriendship(name)
    }
    announceFriendship(name){
        global.console.log(`${name} is now a friend!`)
    }
    removeFriend(name){
        const idx = this.friends.indexOf(name)
        if(idx === -1){
            throw new Error('Friend not found!')
        }
        this.friends.splice(idx,1)
    }
}
// tests
describe('Friendslist', () => {
    let friendsList;
    beforeEach(()=>{
        friendsList = new FriendsList()
    })
    it('initializes friends list',()=>{
        // const friendsList = new FriendsList()
        expect(friendsList.friends.length).toEqual(0)
    })
    it('adds a friend to the list',()=>{
        // const friendsList = new FriendsList()
        friendsList.addFriend('Marcos')
        expect(friendsList.friends.length).toEqual(1)
    })
    it('announces friendship',()=>{
        // const friendsList  = new FriendsList()
        friendsList.announceFriendship = jest.fn()
        friendsList.addFriend('Marcos')
        expect(friendsList.announceFriendship).toHaveBeenCalled()
        // expect(friendsList.announceFriendship).not.toHaveBeenCalled()
        // expect(friendsList.announceFriendship).toHaveBeenCalledTimes(1)
    })

    describe('removeFriend',()=>{
        it('removes a friend on the list',()=>{
            friendsList.addFriend('Marcos')
            expect(friendsList.friends[0]).toEqual('Marcos')
            friendsList.removeFriend('Marcos')
            expect(friendsList.friends[0]).toBeUndefined()
        })
        it('throws an error if friend does not exists',()=>{
            expect(()=>friendsList.removeFriend('Marcos')).toThrow()
            // expect(()=>friendsList.removeFriend('Marcos')).toThrow(new Error('Friend not found!'))
        })
    })
})
