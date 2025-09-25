import React from 'react';
import getApi from '../../app/lib/getApi';
import Link from 'next/link';
import Image from 'next/image';
import Ads from '../../public/assets/media/advertisement/13982910857184178936.gif'

let LeadData = {};
let LeadData2 = [];
async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const Lead = async () => {
    await delay(3000);
    const list = await getApi('home-json-bn/generateLead.json');
    LeadData = list[0];
    LeadData2 = list.slice(1, 4);
    return (
        <div className='Lead-AreaSection'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-9">
                        <div className="row">
                            <div className="col-md-7">
                                <div className="DTopNews">
                                        <Link href={"/details/" + LeadData.categorySlug + "/" + LeadData.ContentID}>
                                            <div className="DImageResize">
                                                <Image src={process.env.NEXT_PUBLIC_IMG_PATH + LeadData.ImageBgPath} alt={LeadData.DetailsHeading} title={LeadData.DetailsHeading}  priority placeholder={undefined} style={{ width: '100%', height: 'auto',position:"relative"}} width={800} height={450} /></div>
                                            <div className="caption">
                                                <h3>{LeadData.DetailsHeading}</h3></div>
                                        </Link>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="CatListWrap">
                                    {LeadData2.map((nc) => {
                                        return (
                                            <div className="Catlist" key={nc.ContentID} >
                                                <Link href={"/details/" + nc.categorySlug + "/" + nc.ContentID}>
                                                    <div className="row">
                                                        <div className="col-md-5 col-5">
                                                            <picture><Image src={process.env.NEXT_PUBLIC_IMG_PATH + nc.ImageSmPath} alt={nc.DetailsHeading} title={nc.DetailsHeading} style={{ width: '100%', height: 'auto',position:"relative" }} priority  width={120} height={67} /></picture>
                                                        </div>
                                                        <div className="col-md-7 col-7">
                                                            <h3 className="Title">{nc.DetailsHeading}</h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="Advertisement">
                            <Image src={Ads} alt="Radhuni" unoptimized title='radhuni' priority />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lead;
