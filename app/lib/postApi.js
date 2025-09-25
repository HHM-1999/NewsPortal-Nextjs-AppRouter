export default async function postApi(apiRoute, submitData){
    // console.log(apiRoute);
    const result= await fetch (`${process.env.NEXT_PUBLIC_API_URL + apiRoute}`,{
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: {
        'content-type': 'application/json'
        },
        // cache: 'no-store'
        // cache: 'force-cache',
        next: { revalidate: 60 } // cache for 60 seconds
        
    });

    return result.json();
}