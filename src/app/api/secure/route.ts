import { NextRequest, NextResponse } from 'next/server'
import { withHighSecurity } from '@/utils/apiMiddleware'

async function handler(req: NextRequest) {
    if (req.method === 'GET') {
        // Ví dụ lấy dữ liệu nhạy cảm
        const sensitiveData = {
            userStats: {
                totalUsers: 1250,
                activeUsers: 892,
                premiumUsers: 156,
            },
            systemHealth: {
                cpuUsage: '45%',
                memoryUsage: '62%',
                diskSpace: '78%',
            },
            apiUsage: {
                totalRequests: 45678,
                errorRate: '0.2%',
                avgResponseTime: '145ms',
            },
        }

        return NextResponse.json({
            success: true,
            data: sensitiveData,
            timestamp: new Date().toISOString(),
        })
    }

    if (req.method === 'POST') {
        try {
            const body = await req.json()

            // Giả lập xử lý dữ liệu nhạy cảm
            if (!body.action) {
                return NextResponse.json(
                    { error: 'Action is required' },
                    { status: 400 },
                )
            }

            const result = {
                success: true,
                message: `Action "${body.action}" executed successfully`,
                actionId: `action_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                executedAt: new Date().toISOString(),
            }

            return NextResponse.json(result)
        } catch {
            return NextResponse.json(
                { error: 'Invalid request data' },
                { status: 400 },
            )
        }
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export const GET = withHighSecurity(handler)
export const POST = withHighSecurity(handler)
