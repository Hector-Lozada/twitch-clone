import { getSelf } from "./auth-service";
import { db } from "./db";

export const getSearch = async (term?: string) => {
    let userId;

    try{
        const self = await getSelf();
        userId = self.id;
    }catch{
        userId = null;
    }

    let streams = [];

    if(userId){
        streams = await db.stream.findMany({
            where:{
                user:{
                    NOT:{
                        blocking:{
                            some:{
                                blockedId: userId
                            },
                        },
                    },
                },
                OR: [
                    {
                        name:{
                            contains: term,
                        },
                    },
                    {
                        user: {
                            username:{
                                contains: term,
                            },
                        },
                    },
                ],
            },
            include:{
                user: true,
            },
            orderBy:[
                {
                    isLive: "desc",
                },
                {
                    updatedAt: "desc",
                },
            ],
        });
    }
    else{
        streams = await db.stream.findMany({
            where:{
                OR: [
                    {
                        name:{
                            contains: term,
                        },
                    },
                    {
                        user: {
                            username:{
                                contains: term,
                            },
                        },
                    },
                ],
            },
            include:{
                user: true,
            },
            orderBy:[
                {
                    isLive: "desc",
                },
                {
                    updatedAt: "desc",
                },
            ],
        });
    };
    return streams;
}