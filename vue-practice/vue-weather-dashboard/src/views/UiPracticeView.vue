<script setup>
// UI 라이브러리(Element Plus) 연습 페이지.
// 기존 화면에 영향을 주지 않도록, 라이브러리를 main.js 에 전역 등록하지 않고
// 이 파일 안에서만 필요한 컴포넌트를 가져다 쓴다. (/ui 경로에 들어올 때만 로드된다)
import { ref, reactive, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElSlider,
  ElRate,
  ElTag,
  ElCard,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElForm,
  ElFormItem,
  ElTabs,
  ElTabPane,
  ElAlert,
  ElDivider,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import 'element-plus/dist/index.css'

// ---------- 1) 입력 요소 ----------
const text = ref('')
const city = ref('')
const agreed = ref(false)
const level = ref(30)
const score = ref(3)

const cityOptions = [
  { value: 'seoul', label: '서울' },
  { value: 'busan', label: '부산' },
  { value: 'jeju', label: '제주' },
]

// ---------- 2) 알림 ----------
const showMessage = (type) => {
  ElMessage({ type, message: `${type} 종류의 알림입니다.` })
}

const confirmDelete = () => {
  ElMessageBox.confirm('정말 삭제할까요?', '확인', {
    confirmButtonText: '삭제',
    cancelButtonText: '취소',
    type: 'warning',
  })
    .then(() => ElMessage.success('삭제했습니다.'))
    // 취소를 누르면 reject 가 되므로 catch 로 받아줘야 콘솔에 에러가 안 뜬다
    .catch(() => ElMessage.info('취소했습니다.'))
}

// ---------- 3) 다이얼로그 ----------
const dialogVisible = ref(false)

// ---------- 4) 테이블 ----------
const members = ref([
  { id: 1, name: '김하늘', city: '서울', role: '관리자' },
  { id: 2, name: '이바다', city: '부산', role: '일반' },
  { id: 3, name: '박구름', city: '제주', role: '일반' },
])

const keyword = ref('')
const filteredMembers = computed(() =>
  members.value.filter((m) => m.name.includes(keyword.value.trim())),
)

// ---------- 5) 폼 + 검증 ----------
const formRef = ref(null)
const form = reactive({ name: '', email: '', city: '' })

// 각 필드에 어떤 규칙을 적용할지 선언해두면 라이브러리가 알아서 검사한다
const rules = {
  name: [
    { required: true, message: '이름을 입력하세요.', trigger: 'blur' },
    { min: 2, message: '2글자 이상 입력하세요.', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '이메일을 입력하세요.', trigger: 'blur' },
    { type: 'email', message: '이메일 형식이 아닙니다.', trigger: 'blur' },
  ],
  city: [{ required: true, message: '도시를 선택하세요.', trigger: 'change' }],
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(`${form.name} 님, 등록되었습니다.`)
    } else {
      ElMessage.error('입력값을 확인하세요.')
    }
  })
}

const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<template>
  <div class="ui-page">
    <h2 class="page-title">🧩 UI 라이브러리 연습 (Element Plus)</h2>

    <ElAlert
      title="이 페이지는 UI 라이브러리 연습용입니다."
      description="날씨 대시보드와는 별개이며, 여기서만 Element Plus 를 사용합니다."
      type="info"
      show-icon
      :closable="false"
      class="intro"
    />

    <!-- ========== 버튼 ========== -->
    <ElCard shadow="never" class="section">
      <template #header><span class="section-title">1. 버튼 (el-button)</span></template>

      <div class="row">
        <ElButton>기본</ElButton>
        <ElButton type="primary">주요</ElButton>
        <ElButton type="success">성공</ElButton>
        <ElButton type="warning">경고</ElButton>
        <ElButton type="danger">위험</ElButton>
      </div>

      <div class="row">
        <ElButton type="primary" plain>테두리만</ElButton>
        <ElButton type="primary" round>둥글게</ElButton>
        <ElButton type="primary" disabled>비활성</ElButton>
        <ElButton type="primary" size="small">작게</ElButton>
        <ElButton type="primary" size="large">크게</ElButton>
      </div>

      <p class="note">
        `type` 으로 색, `size` 로 크기, `plain`·`round`·`disabled` 로 모양이 정해집니다.
        직접 CSS 를 쓰지 않고 <strong>속성만 바꿔서</strong> 모양을 정하는 것이 UI 라이브러리의 방식입니다.
      </p>
    </ElCard>

    <!-- ========== 입력 ========== -->
    <ElCard shadow="never" class="section">
      <template #header><span class="section-title">2. 입력 요소</span></template>

      <div class="field">
        <label>텍스트 입력</label>
        <ElInput v-model="text" placeholder="아무거나 입력해 보세요" clearable />
        <p class="echo">입력값: {{ text || '(비어 있음)' }}</p>
      </div>

      <div class="field">
        <label>선택 (el-select)</label>
        <ElSelect v-model="city" placeholder="도시를 고르세요" clearable>
          <ElOption
            v-for="option in cityOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
        <p class="echo">선택값: {{ city || '(없음)' }}</p>
      </div>

      <div class="field">
        <label>스위치 · 슬라이더 · 별점</label>
        <div class="row">
          <ElSwitch v-model="agreed" active-text="동의" inactive-text="미동의" />
        </div>
        <ElSlider v-model="level" />
        <ElRate v-model="score" show-score />
      </div>

      <p class="note">
        전부 <code>v-model</code> 로 값이 연결됩니다. 우리가 직접 만든 컴포넌트에서
        <code>props</code> + <code>emits</code> 로 하던 것을 라이브러리가 대신 처리해 줍니다.
      </p>
    </ElCard>

    <!-- ========== 알림 ========== -->
    <ElCard shadow="never" class="section">
      <template #header><span class="section-title">3. 알림 (ElMessage · ElMessageBox)</span></template>

      <div class="row">
        <ElButton @click="showMessage('success')">성공 알림</ElButton>
        <ElButton @click="showMessage('warning')">경고 알림</ElButton>
        <ElButton @click="showMessage('error')">에러 알림</ElButton>
        <ElButton type="danger" @click="confirmDelete">삭제 확인창</ElButton>
      </div>

      <p class="note">
        태그가 아니라 <strong>함수로 부르는 컴포넌트</strong>입니다. 과제에서 쓰던
        <code>window.alert()</code> 을 대체하며, 확인창은 Promise 라 사용자의 선택을
        <code>.then</code> / <code>.catch</code> 로 나눠 받습니다.
      </p>
    </ElCard>

    <!-- ========== 다이얼로그 ========== -->
    <ElCard shadow="never" class="section">
      <template #header><span class="section-title">4. 다이얼로그 (el-dialog)</span></template>

      <ElButton type="primary" @click="dialogVisible = true">창 열기</ElButton>

      <ElDialog v-model="dialogVisible" title="안내" width="320px">
        <p>v-model 에 연결된 값이 true 가 되면 열립니다.</p>
        <template #footer>
          <ElButton @click="dialogVisible = false">닫기</ElButton>
          <ElButton type="primary" @click="dialogVisible = false">확인</ElButton>
        </template>
      </ElDialog>

      <p class="note">
        열림/닫힘 상태를 <code>v-model</code> 로 직접 들고 있습니다. 버튼 영역은
        <code>#footer</code> 라는 <strong>이름있는 slot</strong> 입니다. 과제에서 배운 slot 이 그대로 쓰입니다.
      </p>
    </ElCard>

    <!-- ========== 테이블 ========== -->
    <ElCard shadow="never" class="section">
      <template #header><span class="section-title">5. 테이블 + 검색 (el-table)</span></template>

      <ElInput v-model="keyword" placeholder="이름으로 검색" clearable class="search" />

      <ElTable :data="filteredMembers" stripe border style="width: 100%">
        <ElTableColumn prop="id" label="번호" width="70" />
        <ElTableColumn prop="name" label="이름" />
        <ElTableColumn prop="city" label="도시" />
        <ElTableColumn label="역할">
          <!-- 셀 안을 직접 그리고 싶을 때도 slot 을 쓴다 -->
          <template #default="scope">
            <ElTag :type="scope.row.role === '관리자' ? 'danger' : 'info'" size="small">
              {{ scope.row.role }}
            </ElTag>
          </template>
        </ElTableColumn>
      </ElTable>

      <p class="note">
        <code>#default="scope"</code> 는 과제에서 배운 <strong>Scoped Slot</strong> 입니다.
        자식(테이블)이 각 행 데이터를 <code>scope</code> 에 담아 넘겨주고, 모양은 우리가 정합니다.
      </p>
    </ElCard>

    <!-- ========== 폼 검증 ========== -->
    <ElCard shadow="never" class="section">
      <template #header><span class="section-title">6. 폼 검증 (el-form)</span></template>

      <ElForm ref="formRef" :model="form" :rules="rules" label-width="70px">
        <ElFormItem label="이름" prop="name">
          <ElInput v-model="form.name" placeholder="2글자 이상" />
        </ElFormItem>

        <ElFormItem label="이메일" prop="email">
          <ElInput v-model="form.email" placeholder="you@example.com" />
        </ElFormItem>

        <ElFormItem label="도시" prop="city">
          <ElSelect v-model="form.city" placeholder="선택하세요">
            <ElOption
              v-for="option in cityOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem>
          <ElButton type="primary" @click="submitForm">등록</ElButton>
          <ElButton @click="resetForm">초기화</ElButton>
        </ElFormItem>
      </ElForm>

      <p class="note">
        규칙을 <code>rules</code> 객체에 <strong>선언</strong>해두면 검사·에러 문구 표시를 라이브러리가 합니다.
        직접 만들면 필드마다 if 문을 쓰고 에러 메시지 위치까지 잡아야 하는 일입니다.
      </p>
    </ElCard>

    <!-- ========== 탭 ========== -->
    <ElCard shadow="never" class="section">
      <template #header><span class="section-title">7. 탭 (el-tabs)</span></template>

      <ElTabs>
        <ElTabPane label="첫 번째">첫 번째 탭 내용입니다.</ElTabPane>
        <ElTabPane label="두 번째">두 번째 탭 내용입니다.</ElTabPane>
        <ElTabPane label="세 번째">세 번째 탭 내용입니다.</ElTabPane>
      </ElTabs>

      <ElDivider />

      <p class="note">
        과제 1~3 에서 <code>ref</code> 와 <code>v-if</code> 로 직접 만들었던 탭 전환이
        태그 몇 줄로 끝납니다.
      </p>
    </ElCard>

    <RouterLink class="back-link" to="/">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.ui-page {
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 2rem;
  color: var(--color-text);
}

.page-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.intro {
  margin-bottom: 1rem;
}

.section {
  margin-bottom: 1rem;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 600;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.8rem;
  color: #8b8880;
}

.echo,
.note {
  font-size: 0.78rem;
  color: #8b8880;
  line-height: 1.6;
}

.echo {
  margin-top: 0.35rem;
}

.note {
  margin-top: 0.75rem;
  padding-top: 0.6rem;
  border-top: 1px dashed #eceae5;
}

.search {
  margin-bottom: 0.75rem;
}

.back-link {
  display: block;
  padding: 0.6rem;
  border: 1px solid #e9e6e0;
  border-radius: 10px;
  background: #ffffff;
  color: #4c7397;
  font-size: 0.85rem;
  text-align: center;
  text-decoration: none;
}
</style>
