import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateInvoice = (orderData) => {
    try {
        const {
            orderId,
            orderItems,
            totalAmt,
            subTotalAmt,
            handlingCharge,
            deliveryAddress,
            paymentStatus,
            orderDate,
            orderTime
        } = orderData

        // Create new PDF document
        const doc = new jsPDF()

        // Define colors
        const primaryColor = [12, 131, 31] // Green
        const darkGray = [51, 51, 51]
        const lightGray = [128, 128, 128]

        // Company Header
        doc.setFillColor(...primaryColor)
        doc.rect(0, 0, 210, 40, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFontSize(28)
        doc.setFont('helvetica', 'bold')
        doc.text('EasyBuy', 15, 20)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text('Your trusted grocery partner', 15, 28)
        doc.text('Delivery in 8 minutes', 15, 34)

        // Invoice Title
        doc.setTextColor(...darkGray)
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('INVOICE', 150, 20)

        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...lightGray)
        doc.text(`Date: ${orderDate}`, 150, 28)
        doc.text(`Time: ${orderTime}`, 150, 33)

        // Order Information Section
        let yPos = 50

        doc.setFillColor(245, 245, 245)
        doc.rect(15, yPos, 180, 25, 'F')

        doc.setTextColor(...darkGray)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('Order Details', 20, yPos + 8)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.text(`Order ID: ${orderId}`, 20, yPos + 15)
        doc.text(`Payment: ${paymentStatus === 'CASH ON DELIVERY' ? 'Cash on Delivery' : 'Paid Online'}`, 20, yPos + 21)

        // Delivery Address
        yPos += 35
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text('Delivery Address', 15, yPos)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...lightGray)

        const addressLines = [
            deliveryAddress?.address_line || '',
            `${deliveryAddress?.city || ''}, ${deliveryAddress?.state || ''}`,
            `${deliveryAddress?.country || ''} - ${deliveryAddress?.pincode || ''}`,
            deliveryAddress?.mobile ? `Mobile: ${deliveryAddress.mobile}` : ''
        ].filter(line => line.trim())

        addressLines.forEach((line, index) => {
            doc.text(line, 15, yPos + 7 + (index * 5))
        })

        // Items Table
        yPos += 35

        const tableData = orderItems.map(item => [
            item.product_details?.name || 'Product',
            item.quantity?.toString() || '1',
            `₹${(item.totalAmt / (item.quantity || 1)).toFixed(2)}`,
            `₹${item.totalAmt?.toFixed(2) || '0.00'}`
        ])

    autoTable(doc, {
        startY: yPos,
        head: [['Product Name', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9,
            textColor: darkGray
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250]
        },
        columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 40, halign: 'right' },
            3: { cellWidth: 40, halign: 'right' }
        },
        margin: { left: 15, right: 15 }
    })

        // Bill Summary
        const finalY = doc.lastAutoTable.finalY + 10

        doc.setDrawColor(200, 200, 200)
        doc.line(15, finalY, 195, finalY)

        const summaryX = 130
        let summaryY = finalY + 10

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...darkGray)

        // Item Total
        doc.text('Item Total:', summaryX, summaryY)
        doc.text(`₹${subTotalAmt.toFixed(2)}`, 185, summaryY, { align: 'right' })

        summaryY += 6
        doc.text('Delivery Charge:', summaryX, summaryY)
        doc.setTextColor(...primaryColor)
        doc.setFont('helvetica', 'bold')
        doc.text('FREE', 185, summaryY, { align: 'right' })

        summaryY += 6
        doc.setTextColor(...darkGray)
        doc.setFont('helvetica', 'normal')
        doc.text('Handling Charge:', summaryX, summaryY)
        doc.text(`₹${handlingCharge.toFixed(2)}`, 185, summaryY, { align: 'right' })

        // Grand Total
        summaryY += 8
        doc.setDrawColor(...primaryColor)
        doc.setLineWidth(0.5)
        doc.line(summaryX, summaryY - 2, 195, summaryY - 2)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(...primaryColor)
        doc.text('Grand Total:', summaryX, summaryY + 4)
        doc.text(`₹${(totalAmt + handlingCharge).toFixed(2)}`, 185, summaryY + 4, { align: 'right' })

        // Footer
        const pageHeight = doc.internal.pageSize.height
        doc.setFontSize(8)
        doc.setTextColor(...lightGray)
        doc.setFont('helvetica', 'italic')
        doc.text('Thank you for shopping with EasyBuy!', 105, pageHeight - 20, { align: 'center' })
        doc.text('For any queries, contact us at support@easybuy.com', 105, pageHeight - 15, { align: 'center' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        doc.text('This is a computer-generated invoice and does not require a signature.', 105, pageHeight - 10, { align: 'center' })

        // Save the PDF
        doc.save(`EasyBuy_Invoice_${orderId}.pdf`)
        console.log('Invoice generated successfully:', orderId)

    } catch (error) {
        console.error('Error generating invoice:', error)
        console.error('Error stack:', error.stack)
        alert(`Failed to generate invoice: ${error.message}\n\nPlease check the console for details.`)
    }
}
