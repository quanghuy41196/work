import { NextRequest, NextResponse } from 'next/server'
import { withApiSecurity } from '@/utils/apiMiddleware'

async function handler(req: NextRequest) {
    if (req.method === 'GET') {
        // Ví dụ API công khai
        return NextResponse.json({
            message: 'Public API endpoint',
            timestamp: new Date().toISOString(),
            data: {
                version: '1.0.0',
                status: 'active',
            },
        })
    }

    if (req.method === 'POST') {
        try {
            const body = await req.json()

            // Xử lý dữ liệu
            const response = {
                message: 'Data processed successfully',
                receivedData: body,
                processedAt: new Date().toISOString(),
            }

            return NextResponse.json(response)
        } catch {
            return NextResponse.json(
                { error: 'Invalid JSON data' },
                { status: 400 },
            )
        }
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export const GET = withApiSecurity(handler)
export const POST = withApiSecurity(handler)
