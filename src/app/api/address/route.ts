import { NextResponse } from 'next/server'
import * as os from 'os'

export const GET = () => {
  const networkInterfaces = os.networkInterfaces()
  return NextResponse.json(networkInterfaces)
}
