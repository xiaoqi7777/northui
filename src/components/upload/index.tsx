import React, {
	useCallback,
	useMemo,
	useRef,
	useState,
	ReactNode
} from "react";
import {
	AxiosRequestConfig,
  } from "axios";
import { color } from "../shared/styles";
import  Button  from "../button";
import { message } from "../message";
import { Progress } from "../progress";
import { Modal } from "../modal";
import { Icon } from "../icon";
import {
	onProgressType,
	ProgressBar,
	postData,
	resolveFilename,
	getBase64,
	ImgUpload,
	btnStyle,
	rotateBtnStyle,
	ProgressLi,
	ProgressListItem,
	ProgressListItemName,
	chooseProgressListColor,
	ImgCloseBtn,
	ImgWrapper,
	updateFilist,
	IconSpin
} from './label';

type UploadMode = 'default' | 'img';

type ModalContentType = {
    rotate: number;
    times: number;
    left: number,
    top: number,
    img: HTMLImageElement;
};

type UploadProps = {
	/** 上传字段名*/
	uploadFilename: string[] | string;
	/** 发送设置，参考axios */
	axiosConfig?: Partial<AxiosRequestConfig>;
	/** 获取进度 */
	onProgress?: onProgressType;
	/** 成功回调 */
	successCallback?: ((res: any, i: number) => void) | undefined;
	/** 失败回调 */
	failCallback?: ((res: any, i: number) => void) | undefined;
	/** 上传列表初始值 */
	defaultProgressBar?: ProgressBar[];
	/** 如果返回promise，需要提供file，否则同步需要返回boolean，如果为false，则不发送*/
	beforeUpload?: (f: File, i: number) => boolean | Promise<File>;
	/** 上传模式 2种 */
	uploadMode?: UploadMode
	/** 是否开启进度列表 */
	progress?: boolean;
	/** 删除回调 */
	onRemoveCallback?: (f: ProgressBar) => void;
	/** 自定义删除行为，只有img与progress为true有效*/
	customRemove?: (
		file: ProgressBar,
		setFlist: React.Dispatch<React.SetStateAction<ProgressBar[]>>
	) => void;
	/** 允许上传最大容量*/
	max?: number;
	/** input的accept属性 */
	accept?: string;
	/** input的multiple属性   multiple为true和max冲突*/
	multiple?: boolean;
	/** 用户自定义按钮 */
	customBtn?: ReactNode;
	slice?:boolean;
	};

  
  export function Upload(props: UploadProps) {
	const {
	  axiosConfig,
	  onProgress,
	  defaultProgressBar,
	  uploadFilename,
	  successCallback,
	  failCallback,
	  beforeUpload,
	  uploadMode,
	  progress,
	  customRemove,
	  onRemoveCallback,
	  max,
	  multiple,
	  accept,
	  customBtn,
	} = props;
	const [flist, setFlist] = useState<ProgressBar[]>(defaultProgressBar || []);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalContent, setModalContent] = useState<ModalContentType>({
	  rotate: 0,
	  times: 1,
	  img: new Image(),
	  left: 0,
	  top: 0,
	});
	const [mouseActive, setMouseActive] = useState(false);
	const [startXY, setStartXY] = useState({ X: 0, Y: 0 });
	const [rescallback, setResCallback] = useState<{ restfn: Function }>({
	  restfn: () => { },
	});
  
	const inputRef = useRef<HTMLInputElement>(null);
  
	const canvasRef = useRef<HTMLCanvasElement>(null);
  
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
	  if (e.target.files && e.target.files.length <= 0) return;
	  let filelist = Array.from(e.target.files);
	  filelist.forEach((f, i) => {
		//裁剪会改变file
		const restfn = (f: File) => {
		  if (beforeUpload) {
			const p = beforeUpload(f, i);
			if (p instanceof Promise) {
			  p.then((res: File) => {
				postData(
				  res,
				  resolveFilename(uploadFilename, i),
				  axiosConfig!,
				  i,
				  onProgress,
				  setFlist,
				  successCallback,
				  failCallback
				);
			  });
			} else {
			  if (p) {
				//false不执行
				postData(
				  f,
				  resolveFilename(uploadFilename, i),
				  axiosConfig!,
				  i,
				  onProgress,
				  setFlist,
				  successCallback,
				  failCallback
				);
			  }
			}
		  } else {
			postData(
			  f,
			  resolveFilename(uploadFilename, i),
			  axiosConfig!,
			  i,
			  onProgress,
			  setFlist,
			  successCallback,
			  failCallback
			);
		  }
		};
		setResCallback({ restfn });
		if (showSlice) {
		  setModalOpen(true);
		  showModalToSlice(f, canvasRef, modalContent);
		} else {
		  restfn(f);
		}
	  });
	};
  
	const handleClick = () => {
	  inputRef.current?.click();
	};
  
	const resolveBtnLoading = function (flist: ProgressBar[]) {
	  return flist.some((v) => v.status === "upload");
	};
  
	const onRemove = useCallback(
	  (file: ProgressBar) => {
		if (customRemove) {
		  customRemove(file, setFlist);
		} else {
		  setFlist((prev) => {
			return prev.filter((item) => {
			  if (
				item.uid === file.uid &&
				item.status === "upload" &&
				item.cancel
			  ) {
				item.cancel.cancel();
			  }
			  return item.uid !== file.uid;
			});
		  });
		}
  
		if (onRemoveCallback) {
		  onRemoveCallback(file);
		}
	  },
	  [customRemove, onRemoveCallback]
	);
  
	const shouldShow = useMemo(() => {
	  if (max !== undefined) {
		return flist.length < max;
	  } else {
		return true;
	  }
	}, [max, flist]);
  
	// 图片裁切功能
	const showSlice = useMemo(() => {
	  if (!multiple && uploadMode === 'img') {
		return true
	  } else {
		return false
	  }
	}, [multiple, uploadMode]);
	
	const uploadFn = (
		modalContent:ModalContentType,
		canvas: HTMLCanvasElement
	) => {
		const _href = canvas.toDataURL();
        // base64格式:类型+,+数据 
        // atob 转换的时候只能对base64的数据进行处理
        let bytes = atob(_href.split(',')[1])
        let arrayBuffer = new ArrayBuffer(bytes.length)
        let uint8Array = new Uint8Array(arrayBuffer);
        for(let i=0;i<bytes.length;i++){
          uint8Array[i] = bytes.charCodeAt(i)
        }
        let blob = new Blob([uint8Array],{type:'image/png'});
		let files = new window.File([blob], 'name.png', {type: 'image/png'})
		postData(
			files,
			resolveFilename(uploadFilename, 1),
			axiosConfig!,
			1,
			onProgress,
			setFlist,
			successCallback,
			failCallback
		  );
		// setModalOpen(true);
		// showModalToSlice(files, canvasRef, modalContent);
	}

	const cavasDraw = function (
	  modalContent: ModalContentType,
	  canvas: HTMLCanvasElement
	) {
	  const image = modalContent.img;
	  const ctx = canvas.getContext("2d");
	  // eslint-disable-next-line no-self-assign
	  canvas.height = canvas.height; //清屏
	  let imgWidth = image.width;
	  let imgHeight = image.height;
	  //canvas宽高300,判断图片长宽谁长，取长的
	  const times = modalContent.times;
	  if (imgWidth > imgHeight) {
		//如果宽比高度大
		let rate = canvas.width / imgWidth;
		imgWidth = canvas.width * times; //让宽度等于canvas宽度
		imgHeight = imgHeight * rate * times; //然后让高度等比缩放
	  } else {
		let rate = canvas.height / imgHeight;
		imgHeight = canvas.height * times;
		imgWidth = imgWidth * rate * times;
	  }
	  //此时，长宽已等比例缩放，算起始点位偏移，起始高度就是canvas高-图片高再除2 宽度同理
	  const startX = (canvas.width - imgWidth) / 2;
	  const startY = (canvas.height - imgHeight) / 2;
	  //旋转操作
	  //旋转首先移动原点到图片中心，这里中心是canvas中心,然后再移动回来
	  const midX = canvas.width / 2;
	  const midY = canvas.height / 2;
	  ctx?.translate(midX, midY);
  
	  ctx?.rotate(modalContent.rotate);
	  ctx?.drawImage(
		image,
		startX - midX + modalContent.left,
		startY - midY + modalContent.top,
		imgWidth,
		imgHeight);
	  ctx?.translate(0, 0);
	};
  
	const showModalToSlice = function (
	  f: File,
	  canvasRef: React.RefObject<HTMLCanvasElement>,
	  modalContent: ModalContentType
	) {
	  getBase64(f, (s: string) => {
		const canvas = canvasRef.current;
		if (canvas) {
		  modalContent.img.src = s;
		  modalContent.img.onload = () => {
			cavasDraw(modalContent, canvas);
		  };
		}
	  });
	};
  
	const handleMouseDown = (
	  e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
	  setMouseActive(true);
	  setStartXY({
		X: e.clientX - modalContent.left,
		Y: e.clientY - modalContent.top,
	  });
	};
  
	const handleMouseMove = (
	  e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
	  if (mouseActive) {
		let diffX = e.clientX - startXY.X;
		let diffY = e.clientY - startXY.Y;
		let newContent = { ...modalContent, left: diffX, top: diffY };
		setModalContent(newContent);
		cavasDraw(newContent, canvasRef.current!);
	  }
	};
	const handleMouseUp = () => {
	  setMouseActive(false);
	};
	// const handleMouseLeave = () => {
	//   setMouseActive(false);
	// };
  
	return (
	  <div>
		<input
		  ref={inputRef}
		  type="file"
		  onChange={handleChange}
		  style={{ display: "none" }}
		  value=""
		  multiple={multiple}
		  accept={accept}
		/>
		{
		  uploadMode === "default" && progress && (
			<UploadList flist={flist} onRemove={onRemove}></UploadList>
		  )
		}
		{
		  uploadMode === "img" && (
			<ImageList
			  flist={flist}
			  setFlist={setFlist}
			  onRemove={onRemove}
			></ImageList>
		  )
		}
		{
		  shouldShow && uploadMode === "default" && (
			<span onClick={handleClick}>
			  {
				customBtn ? (
				  customBtn
				) : (
					<Button
					  isLoading={resolveBtnLoading(flist)}
					  loadingText="上传中..."
					>
					  upload
					</Button>
				  )}
			</span>
		  )
		}
		{
		  shouldShow && uploadMode === "img" && (
			<ImgUpload onClick={handleClick}>
			  <Icon icon="plus"></Icon>
			</ImgUpload>
		  )
		}
		<Modal
		  title="图片裁剪"
		  callback={(v: boolean) => {
			if (v) {
			  //如果取消，不执行后续上传
			  canvasRef.current!.toBlob(function (blob) {
				if (rescallback.restfn) rescallback.restfn(blob);
			  });
			}
			//清除旋转和倍数
			setModalContent({ ...modalContent, rotate: 0, times: 1 });
		  }}
		  maskClose={false}
		  closeButton={false}
		  visible={modalOpen}
		  parentSetState={setModalOpen}
		>
		  <div
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
		  >
			<canvas
			  width={300}
			  height={300}
			  style={{
				width: "100%",
				height: "100%",
				border: "1px dashed #ff4785",
			  }}
			  ref={canvasRef}
			>
			  您的浏览器不支持Canvas
			</canvas>
		  </div>
		  <div style={{ marginTop: "10px" }}>
			<Button
			  appearance="primary"
			  style={btnStyle}
			  onClick={() => {
				let newContent = {
				  ...modalContent,
				  ...{ times: modalContent.times + 0.1 },
				};
				setModalContent(newContent);
				cavasDraw(newContent, canvasRef.current!);
			  }}
			>
			  <Icon icon="zoom" color={color.light}></Icon>
			</Button>
			<Button
			  appearance="primary"
			  style={btnStyle}
			  onClick={() => {
				let newContent = {
				  ...modalContent,
				  ...{ times: modalContent.times - 0.1 },
				};
				setModalContent(newContent);
				cavasDraw(newContent, canvasRef.current!);
			  }}
			>
			  <Icon icon="zoomout" color={color.light}></Icon>
			</Button>
			<Button
			  appearance="primary"
			  style={btnStyle}
			  onClick={() => {
				let newContent = {
				  ...modalContent,
				  ...{ rotate: modalContent.rotate - 0.1 },
				};
				setModalContent(newContent);
				cavasDraw(newContent, canvasRef.current!);
			  }}
			>
			  <Icon icon="undo" color={color.light}></Icon>
			</Button>
			<Button
			  appearance="primary"
			  style={rotateBtnStyle}
			  onClick={() => {
				let newContent = {
				  ...modalContent,
				  ...{ rotate: modalContent.rotate + 0.1 },
				};
				setModalContent(newContent);
				cavasDraw(newContent, canvasRef.current!);
			  }}
			>
			  <Icon icon="undo" color={color.light}></Icon>
			</Button>
			<Button
			  appearance="primary"
			  style={btnStyle}
			  onClick={() => {
				let newContent = {
				  ...modalContent,
				  rotate: 0,
				  times: 1,
				  left: 0,
				  top: 0,
				};
				setModalContent(newContent);
				cavasDraw(newContent, canvasRef.current!);
			  }}
			>
			  <Icon icon="zoomreset" color={color.light}></Icon>
			</Button>
			<Button
			  appearance="primary"
			  style={btnStyle}
			  onClick={() => {
				uploadFn(modalContent, canvasRef.current!);
			  }}
			>
				上传
			</Button>
		  </div>
		</Modal>
	  </div>
	);
  }
  
  Upload.defaultProps = {
	uploadMode: "default",
	axiosConfig: {},
	uploadFilename: "avatar",
	successCallback: () => message.success("上传成功"),
	failCallbakc: () => message.error("上传失败"),
  };
  
  export interface UploadListProps {
	flist: ProgressBar[];
	onRemove: (item: ProgressBar) => void;
  }
  
  export function UploadList(props: UploadListProps) {
	const { flist, onRemove } = props;
	return (
	  <ul style={{ padding: "10px" }}>
		{flist.map((item) => {
		  return (
			<ProgressLi key={item.uid}>
			  <ProgressListItem>
				<ProgressListItemName status={item.status}>
				  {item.filename}
				</ProgressListItemName>
				<div>
				  <Button
					style={{
					  padding: "0",
					  background: "transparent",
					}}
					onClick={() => onRemove(item)}
				  >
					<Icon
					  icon="close"
					  color={chooseProgressListColor(
						item.status
					  )}
					></Icon>
				  </Button>
				</div>
			  </ProgressListItem>
  
			  {(item.status === "upload" ||
				item.status === "ready") && (
				  <Progress count={item.percent}></Progress>
				)}
			</ProgressLi>
		  );
		})}
	  </ul>
	);
  }
  
  export interface imageListProps extends UploadListProps {
	setFlist: React.Dispatch<React.SetStateAction<ProgressBar[]>>;
  }
  
  export function ImageList(props: imageListProps) {
	const { flist, onRemove, setFlist } = props;
	useMemo(() => {
	  if (flist) {
		flist.forEach((item) => {
		  if (item.raw && !item.img) {
			//如果有文件并且没有img地址，生成blob地址
			getBase64(item.raw, (e: string) => {
			  updateFilist(setFlist, item, {
				img: e || "error",
			  });
			});
		  }
		});
	  }
	}, [flist, setFlist]);
	return (
	  <React.Fragment>
		{
		  flist.map((item) => {
			return (
			  <span key={item.uid}>
				<ImgWrapper>
				  {item.status === "success" && (
					<img
					  src={item.img as string}
					  alt="upload img"
					></img>
				  )}
				  {(item.status === "ready" ||
					item.status === "upload") && (
					  <IconSpin>
						<Icon
						  icon="sync"
						  color={color.warning}
						></Icon>
					  </IconSpin>
					)}
				  {item.status === "failed" && (
					<Icon
					  icon="photo"
					  color={color.negative}
					></Icon>
				  )}
				  <ImgCloseBtn
					className="closebtn"
					onClick={() => onRemove(item)}
				  >
					<Icon icon="trash" color={color.light}></Icon>
				  </ImgCloseBtn>
				</ImgWrapper>
			  </span>
			);
		  })
		}
	  </React.Fragment>
	);
  }