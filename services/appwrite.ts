import { Client, Databases, ID, Query } from 'react-native-appwrite';

//track the searches made by user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io.v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    console.log('Updating search count for:', query);
    try{
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', query),
    ])
    //check if a record of that search term has already been stored
    if (result.documents.length > 0) {
        const existingMovie = result.documents[0];
        await database.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            existingMovie.$id,
            {
                count: existingMovie.count + 1
            }
        )
        console.log('Updated existing document:', existingMovie.$id);
    }else{
        await database.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),{
                searchTerm: query,
                count: 1,
                title: movie.title,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            }
        )
        console.log('Created new document:', ID.unique());
    }
    //if a document is found increament the search field
    //if no document is found create a new document in apwrite database -. 1

    console.log(result);
    
}
catch (error) {
        console.log(error);
        throw error;
    }
};