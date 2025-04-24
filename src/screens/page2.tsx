import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, QrCodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Buildings from './../assets/buildings.png';

// Validation schema
const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  designation: Yup.string().required('Designation is required'),
  lgu_agency: Yup.string().required('LGU/Agency is required'),
});

const Page2 = () => {
  const [showQR, setShowQR] = useState(false);
  const [formData, setFormData] = useState(null);

  return (
    <div className="min-h-screen   flex flex-col items-center justify-center">
      <img src={Buildings} className="pointer-events-none w-full object-contain fixed bottom-0 z-0" alt="" />
      <div className="w-full max-w-md p-6">
        <div className="bg-white -lg rounded-lg overflow-hidden">
          {!showQR ? (
            <Formik
              initialValues={{
                name: "",
                email: "",
                designation: "",
                lgu_agency: ""
              }}
              validationSchema={ValidationSchema}
              onSubmit={(values:any) => {
                setFormData(values);
                setShowQR(true);
              }}
            >
              {({ errors, touched }:any) => (
                <Form className="px-8 pt-8 pb-8">
                  <h2 className="text-4xl font-bold mb-8 text-center  text-primary">Registration Form</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <Field
                      className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:-outline"
                      name="name"
                      type="text"
                      placeholder="Tailor Swift"
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-xs italic">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                      Email
                    </label>
                    <Field
                      className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:-outline"
                      name="email"
                      type="email"
                      placeholder="tailor@dict.gov.ph"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-xs italic">{errors.email}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="designation">
                      Designation
                    </label>
                    <Field
                      className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:-outline"
                      name="designation"
                      type="text"
                      placeholder="Singer and Songwriter"
                    />
                    {errors.designation && touched.designation && (
                      <p className="text-red-500 text-xs italic">{errors.designation}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lgu_agency">
                      LGU/Agency
                    </label>
                    <Field
                      className=" appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:-outline"
                      name="lgu_agency"
                      type="text"
                      placeholder="Department of Information and Communications Technology"
                    />
                    {errors.lgu_agency && touched.lgu_agency && (
                      <p className="text-red-500 text-xs italic">{errors.lgu_agency}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-center mt-8">
                    <Button  type='submit' className="bg-blue-600 flex gap-2 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:-outline transform transition-all duration-200 hover:scale-105">
                    Submit Details
                    <QrCodeIcon className=' h-4 w-4'/>
                    </Button>
                   
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="px-8 pt-8 pb-8">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Your QR Code</h2>
                
                <div className="mb-8 bg-white p-4 rounded-lg -inner">
                  <QRCodeSVG
                    value={JSON.stringify(formData)}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <button
                  onClick={() => setShowQR(false)}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:-outline transform transition-all duration-200 hover:scale-105"
                >
                  <ArrowLeft size={20} />
                  Back to Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page2;