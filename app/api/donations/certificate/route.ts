import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import PDFDocument from 'pdfkit'

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    if (auth.user.role !== 'donor' && auth.user.role !== 'hospital' && auth.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to generate certificates' }, { status: 403 })
    }

    const body = await req.json()
    const {
      donorName,
      bloodGroup,
      hospitalName,
      donationDate,
      donationId,
    } = body

    if (!donorName || !bloodGroup || !hospitalName) {
      return NextResponse.json(
        { error: 'Donor name, blood group, and hospital name are required' },
        { status: 400 }
      )
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))

    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('BloodNet', { align: 'center' })
      .fontSize(14)
      .font('Helvetica')
      .text('Blood Donation Certificate', { align: 'center' })

    doc.moveDown(0.5)
    doc
      .fontSize(10)
      .text(
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        { align: 'center' }
      )

    doc.moveDown(1.5)
    doc
      .fontSize(12)
      .font('Helvetica')
      .text('This certificate is presented to', { align: 'center' })

    doc.moveDown(0.3)
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text(donorName, { align: 'center' })

    doc.moveDown(0.8)
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(
        'For making a generous blood donation of',
        { align: 'center' }
      )

    doc.moveDown(0.4)
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(`${bloodGroup} Blood Type`, { align: 'center' })

    doc.moveDown(0.8)
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(
        `at ${hospitalName}`,
        { align: 'center' }
      )

    doc.moveDown(1.5)
    doc
      .fontSize(10)
      .text(
        'Your generous donation has helped save lives. One unit of blood can save up to three lives.',
        { align: 'center' }
      )

    doc.moveDown(2)
    doc.fontSize(10).font('Helvetica-Bold').text('Donation Details:', 50)
    doc.fontSize(9).font('Helvetica')

    const details = [
      [`Donor Name: ${donorName}`],
      [`Blood Type: ${bloodGroup}`],
      [`Hospital: ${hospitalName}`],
      [`Date: ${donationDate || new Date().toLocaleDateString()}`],
      [`Certificate ID: ${donationId || Math.random().toString(36).substr(2, 9).toUpperCase()}`],
    ]

    details.forEach((detail) => {
      doc.text(detail[0], 70)
      doc.moveDown(0.3)
    })

    doc.moveDown(2)
    doc
      .fontSize(10)
      .text(
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        { align: 'center' }
      )
    doc.moveDown(0.5)
    doc
      .fontSize(9)
      .text(
        'BloodNet | Connecting Donors, Saving Lives',
        { align: 'center' }
      )
    doc.text('www.bloodnet.org | support@bloodnet.org', {
      align: 'center',
    })

    doc.end()

    await new Promise((resolve, reject) => {
      doc.on('end', resolve)
      doc.on('error', reject)
    })

    const pdfBuffer = Buffer.concat(chunks)

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="BloodNet_Certificate_${donorName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf"`,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Certificate generation failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
