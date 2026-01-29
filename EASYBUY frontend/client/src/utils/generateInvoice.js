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
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(22)
        doc.setFont('helvetica', 'bold')
        doc.text('INVOICE', 150, 20)

        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(220, 220, 220)
        doc.text(`Date: ${orderDate}`, 150, 28)
        doc.text(`Time: ${orderTime}`, 150, 33)

        // Order Information Section
        let yPos = 55

        doc.setDrawColor(240, 240, 240)
        doc.setFillColor(250, 250, 250)
        doc.roundedRect(15, yPos, 180, 28, 3, 3, 'FD')

        doc.setTextColor(...primaryColor)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('Order Details', 20, yPos + 8)

        doc.setTextColor(...darkGray)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.text(`Order ID: ${orderId}`, 20, yPos + 16)
        doc.text(`Payment: ${paymentStatus === 'CASH ON DELIVERY' ? 'Cash on Delivery' : 'Paid Online'}`, 20, yPos + 22)

        // Delivery Address
        yPos += 38
        
        // Address Box
        doc.setDrawColor(240, 240, 240)
        doc.setFillColor(255, 255, 255)
        // doc.roundedRect(15, yPos, 85, 30, 3, 3, 'S')

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(...primaryColor)
        doc.text('Delivery Address', 15, yPos)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(...darkGray)

        const addressLines = [
            deliveryAddress?.address_line || '',
            `${deliveryAddress?.city || ''}, ${deliveryAddress?.state || ''}`,
            `${deliveryAddress?.country || ''} - ${deliveryAddress?.pincode || ''}`,
            deliveryAddress?.mobile ? `Mobile: ${deliveryAddress.mobile}` : ''
        ].filter(line => line.trim())

        let addrY = yPos + 7
        addressLines.forEach((line) => {
            doc.text(line, 15, addrY)
            addrY += 5
        })

        // Items Table
        yPos += 35

        const tableData = orderItems.map(item => [
            item.product_details?.name || 'Product',
            item.quantity?.toString() || '1',
            `Rs. ${(item.totalAmt / (item.quantity || 1)).toFixed(2)}`,
            `Rs. ${item.totalAmt?.toFixed(2) || '0.00'}`
        ])

        autoTable(doc, {
            startY: yPos,
            head: [['Product Name', 'Qty', 'Unit Price', 'Total']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                fontSize: 10,
                halign: 'left'
            },
            bodyStyles: {
                fontSize: 10,
                textColor: darkGray,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [248, 252, 248]
            },
            columnStyles: {
                0: { cellWidth: 90 },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 35, halign: 'right' },
                3: { cellWidth: 35, halign: 'right' }
            },
            styles: {
                lineColor: [230, 230, 230],
                lineWidth: 0.1
            },
            margin: { left: 15, right: 15 }
        })

        // Bill Summary
        const finalY = doc.lastAutoTable.finalY + 15
        const summaryWidth = 70
        const summaryX = 210 - 15 - summaryWidth
        let summaryY = finalY

        // Summary Box Background
        // doc.setFillColor(250, 250, 250)
        // doc.roundedRect(summaryX - 5, summaryY - 5, summaryWidth + 5, 40, 2, 2, 'F')

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(...darkGray)

        // Item Total
        doc.text('Item Total:', summaryX, summaryY)
        doc.text(`Rs. ${subTotalAmt.toFixed(2)}`, 195, summaryY, { align: 'right' })

        summaryY += 8
        doc.text('Delivery Charge:', summaryX, summaryY)
        doc.setTextColor(...primaryColor)
        doc.setFont('helvetica', 'bold')
        doc.text('FREE', 195, summaryY, { align: 'right' })

        summaryY += 8
        doc.setTextColor(...darkGray)
        doc.setFont('helvetica', 'normal')
        doc.text('Handling Charge:', summaryX, summaryY)
        doc.text(`Rs. ${handlingCharge.toFixed(2)}`, 195, summaryY, { align: 'right' })

        // Grand Total
        summaryY += 10
        doc.setDrawColor(...primaryColor)
        doc.setLineWidth(0.5)
        doc.line(summaryX, summaryY - 4, 195, summaryY - 4)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(...primaryColor)
        doc.text('Grand Total:', summaryX, summaryY + 2)
        doc.text(`Rs. ${(totalAmt + handlingCharge).toFixed(2)}`, 195, summaryY + 2, { align: 'right' })

        // Footer
        const pageHeight = doc.internal.pageSize.height
        
        // Footer Line
        doc.setDrawColor(230, 230, 230)
        doc.setLineWidth(0.5)
        doc.line(15, pageHeight - 35, 195, pageHeight - 35)

        doc.setFontSize(9)
        doc.setTextColor(...lightGray)
        doc.setFont('helvetica', 'italic')
        doc.text('Thank you for shopping with EasyBuy!', 105, pageHeight - 25, { align: 'center' })
        doc.text('For any queries, contact us at support@easybuy.com', 105, pageHeight - 20, { align: 'center' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        doc.setTextColor(150, 150, 150)
        doc.text('This is a computer-generated invoice and does not require a signature.', 105, pageHeight - 12, { align: 'center' })

        // Save the PDF
        doc.save(`EasyBuy_Invoice_${orderId}.pdf`)
        console.log('Invoice generated successfully:', orderId)

    } catch (error) {
        console.error('Error generating invoice:', error)
        console.error('Error stack:', error.stack)
        alert(`Failed to generate invoice: ${error.message}\n\nPlease check the console for details.`)
    }
}
