import Role from "../models/Role";

export const createRoles = async () => {

    try{
        const count = await Role.estimatedDocumentCount();

    if (count > 0) return; //if there is already one or more roles created, return

    const values = await Promise.all([
        new Role({name: 'user'}).save(),
        new Role({name: 'moderator'}).save(),
        new Role({name: 'admin'}).save()
    ]); //executes all promises at the same time
    } catch (error){
        console.error(error);
    }

}