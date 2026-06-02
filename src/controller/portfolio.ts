import { connectToDatabase } from "@/config/dbconnect";
import { Condition, ObjectId } from "mongoose";

export async function getMetaData() {
    try {
        const { db } = await connectToDatabase();
        const home = await db.collection('home');

        const result = await home.find({}).toArray();
        return { metaData : result[0] };
    } catch (error) {
        return { message : 'Failed to fetch data' };
    }
}

export async function getAboutData() {
    try {
        const { db } = await connectToDatabase();
        const about = await db.collection('about');

        const result = await about.find({}).toArray();
        return { about : result[0] };
    } catch (error) {
        return { message : 'Failed to fetch data' };
    }
}

export async function getWorkData() {
    try {
        const { db } = await connectToDatabase();
        const work = await db.collection('work');

        const result = await work.find({}).sort({ order: -1, i: -1 }).toArray();
        return { work : result };
    } catch (error) {
        return { message : 'Failed to fetch data' };
    }
}

export async function getProjectData() {
    try {
        const { db } = await connectToDatabase();
        const project = await db.collection('projects');

        const result = await project.find({}).toArray();
        const response : any = {};
        result.forEach(data => {
            response[`section${data.section}`] = data.projects;
        })
        return { project : response };
    } catch (error) {
        return { message : 'Failed to fetch data' };
    }
}


export async function updateWebsiteVisitCount(id : Condition<ObjectId>, visitCount : number) {
    try {
        const { db } = await connectToDatabase();
        const home = await db.collection('home');

        const result = await home.findOneAndUpdate({ "name" : "Navjot Singh" }, { $inc: {"visitCount" : 1} }, { returnDocument: 'after' });
        console.log({result});
        return { message : "Updated Successfully"  };
    } catch (error) {
        return { message : 'Failed to fetch data' };
    }
}
