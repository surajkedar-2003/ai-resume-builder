import Header from '@/components/custom/Header'
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import ResumePreview from '@/dashboard/resume/components/ResumePreview'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../service/GlobalApi'
import { RWebShare } from 'react-web-share'

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState(null); // Explicitly initialize as null
    const { resumeId } = useParams();

    useEffect(() => {
        GetResumeInfo();
    }, [resumeId]); // Add resumeId as a dependency

    const GetResumeInfo = () => {
        GlobalApi.GetResumeById(resumeId)
            .then(resp => {
                console.log(resp.data.data);
                setResumeInfo(resp.data.data);
            })
            .catch(err => console.error(err));
    };

    const HandleDownload = () => {
        window.print();
    };

    if (!resumeInfo) {
        return <div>Loading...</div>; // Show a loading state
    }

    const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost";

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div id="no-print">
                <Header />
                <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
                    <h2 className='text-center text-2xl font-medium'>
                        Congrats! Your Ultimate AI-generated Resume is ready!
                    </h2>
                    <p className='text-center text-gray-400'>
                        Now you are ready to download your resume and share the unique resume URL with your friends and family.
                    </p>
                    <div className='flex justify-between px-44 my-10'>
                        <Button onClick={HandleDownload}>Download</Button>
                        <RWebShare
                            data={{
                                text: "Hello Everyone, This is my resume. Please open the URL to see it.",
                                url: `${baseUrl}/my-resume/${resumeId}/view`,
                                title: `${resumeInfo.firstName} ${resumeInfo.lastName}'s Resume`,
                            }}
                            onClick={() => console.log("Shared successfully!")}
                        >
                            <Button>Share</Button>
                        </RWebShare>
                    </div>
                </div>
            </div>
            <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
                <div id="print-area">
                    <ResumePreview />
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default ViewResume;
