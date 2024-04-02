import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLanesWithTags, getPipelineDetails, updateLaneOrder, updateTicketOrder } from '@/lib/Queries'
import { db } from '@/lib/db'
import { LaneDetail } from '@/lib/types'
import { redirect } from 'next/navigation'
import React from 'react'
import PipelineInfobar from '../_components/pipeline-infobar'
import PipelineSettings from '../_components/pipeline-settings'
import PipelineView from '../_components/pipeline-view'

type Props = {
    params: { subaccountId: string, pipelineId: string }
}

const PipelinePage = async ({ params }: Props) => {
    const pipelineDetails = await getPipelineDetails(params.pipelineId)
    if (!pipelineDetails) {
        return redirect(`/subaccount/${params.subaccountId}/pipelines`)
    }

    const pipelines = await db.pipeline.findMany({
        where: { subAccountId: params.subaccountId },
    })

    const lanes = await getLanesWithTags(params.pipelineId) as LaneDetail[];



    return (
        <Tabs defaultValue='view' className='w-full'>
            <TabsList className='bg-transparent border-b-2 h-16 w-full justify-between gap-4'>
                <PipelineInfobar pipelineId={params.pipelineId} subaccountId={params.subaccountId} pipelines={pipelines} />
                <div>
                    <TabsTrigger value='view' >
                        Pipeline View
                    </TabsTrigger>
                    <TabsTrigger value='settings'>
                        Settings
                    </TabsTrigger>
                </div>
            </TabsList>
            <TabsContent value='view'>
                <PipelineView pipelineId={params.pipelineId} pipelineDetails={pipelineDetails} lanes={lanes} subaccountId={params.subaccountId} updateLanesOrder={updateLaneOrder} updateTicketsOrder={updateTicketOrder} />
            </TabsContent>
            <TabsContent value='settings'>
                <PipelineSettings pipelineId={params.pipelineId} pipelines={pipelines} subaccountId={params.subaccountId} />
            </TabsContent>
        </Tabs>
    )
}

export default PipelinePage