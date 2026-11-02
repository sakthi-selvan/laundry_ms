import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import ExcelJS from 'exceljs';
import {describe,expect,it} from 'vitest';
import {createReceipt} from './documents.js';
import {createReportXlsx} from './report-workbook.js';

const settings={shopName:'Selvam Laundry',address:'12 Main Road, Chennai',phone:'9876543210',companyEmail:'hello@example.com',gstNumber:'33ABCDE1234F1Z5',companyLogoPath:''} as any;
const report={from:'2026-11-01',to:'2026-11-30',orders:12,revenue:5000,collected:4200,outstanding:800,completed:8,daily:[{date:'2026-11-01',orders:2,revenue:600,collected:500}],byService:[{name:'Wash & Iron',quantity:10,revenue:1200}],byPayment:[{method:'upi',amount:2500}]} as any;

describe('formatted sales workbook',()=>{
  it('includes company identity, formatted figures and all report sheets',async()=>{
    const file=path.join(mkdtempSync(path.join(tmpdir(),'laundry-report-')),'report.xlsx');await createReportXlsx(file,report,settings);
    const workbook=new ExcelJS.Workbook();await workbook.xlsx.readFile(file);
    expect(workbook.worksheets.map(sheet=>sheet.name)).toEqual(['Summary','Daily Sales','Services','Payment Methods']);
    const summary=workbook.getWorksheet('Summary')!;expect(summary.getCell('A1').value).toBe('Selvam Laundry');expect(summary.getCell('A3').value).toContain('GSTIN: 33ABCDE1234F1Z5');expect(summary.getCell('B10').numFmt).toContain('₹');expect(summary.getCell('B13').numFmt||'').not.toContain('₹');expect(summary.getCell('A8').font.color?.argb).toBe('FFFFFFFF');
    expect(workbook.getWorksheet('Daily Sales')!.views[0].showGridLines).toBe(false);
  });
  it('creates A4 and thermal branded bill PDFs',async()=>{const folder=mkdtempSync(path.join(tmpdir(),'laundry-bill-')),order={id:'1',orderNumber:'LD-001',customerName:'Kumar',mobile:'9876543210',receivedAt:'2026-11-01T10:00:00Z',expectedDeliveryAt:'2026-11-03T18:00:00Z',subtotal:200,discount:20,total:180,paid:50,balance:130,instructions:'Light starch',items:[{id:'i1',itemName:'Shirt',serviceName:'Wash & Iron',quantity:2,unitPrice:100,total:200,billingMode:'piece',notes:'White shirts'}]} as any,billSettings={...settings,communicationLanguage:'en',receiptFooter:'Thank you',terms:'Check garments at collection.',upiId:'',upiPayeeName:'Selvam Laundry'} as any;await createReceipt(path.join(folder,'a4.pdf'),order,billSettings,'a4');await createReceipt(path.join(folder,'thermal.pdf'),order,billSettings,'thermal')});
});
